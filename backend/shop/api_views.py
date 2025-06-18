from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Review, DeliveryMethod, Manufacturer
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer,
    OrderSerializer, ReviewSerializer, UserSerializer, DeliveryMethodSerializer,
    ManufacturerSerializer
)
from .authentication import BearerTokenAuthentication
from django.contrib.auth import authenticate
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
import logging
from django.db import transaction
from decimal import Decimal

logger = logging.getLogger(__name__)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
            
        return queryset
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, slug=None):
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def list(self, request):
        """Возвращаем корзину пользователя"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id, available=True)
        except Product.DoesNotExist:
            return Response({'error': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        product_id = request.data.get('product_id')
        
        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Товар не найден в корзине'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
        except CartItem.DoesNotExist:
            return Response({'error': 'Товар не найден в корзине'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Переопределённый метод create для правильного создания заказа"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            order = serializer.save()
            
            # Возвращаем серилизованный ответ
            return Response(
                self.get_serializer(order).data, 
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error in OrderViewSet.create: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def partial_update(self, request, *args, **kwargs):
        """Метод для обработки PATCH запросов"""
        try:
            order = self.get_object()
            items_data = request.data.get('items', [])
            
            # Получаем список ID товаров, которые остаются в заказе
            remaining_item_ids = [item['id'] for item in items_data if int(item.get('quantity', 0)) > 0]
            
            with transaction.atomic():
                # Удаляем все товары, которых нет в списке remaining_item_ids
                OrderItem.objects.filter(order=order).exclude(id__in=remaining_item_ids).delete()
                
                # Обновляем количество для оставшихся товаров
                for item_data in items_data:
                    try:
                        item_id = item_data['id']
                        new_quantity = int(item_data['quantity'])
                        
                        if new_quantity > 0:
                            item = OrderItem.objects.get(order=order, id=item_id)
                            item.quantity = new_quantity
                            item.save()
                            
                    except (OrderItem.DoesNotExist, KeyError, ValueError) as e:
                        logger.warning(f"Error updating order item: {str(e)}")
                        continue
                
                # Проверяем, остались ли товары в заказе
                remaining_items = order.orderitem_set.count()
                if remaining_items == 0:
                    # Если товаров не осталось, удаляем весь заказ
                    order.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                
                # Пересчитываем общую стоимость заказа
                total_cost = Decimal('0')
                for item in order.orderitem_set.all():
                    item_cost = item.get_cost()
                    total_cost += item_cost
                
                # Обновляем total_cost через update() и перезагружаем объект
                Order.objects.filter(id=order.id).update(total_cost=total_cost)
                order.refresh_from_db()
                
                # Возвращаем обновленный заказ с правильной общей стоимостью
                serializer = self.get_serializer(order)
                return Response(serializer.data)
                
        except Exception as e:
            logger.error(f"Error in OrderViewSet.partial_update: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [BearerTokenAuthentication]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id) 

class DeliveryMethodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryMethod.objects.all()
    serializer_class = DeliveryMethodSerializer 

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ManufacturerListAPIView(generics.ListAPIView):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer
    pagination_class = PageNumberPagination 

@api_view(['GET', 'DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Заказ не найден'}, status=404)

    if request.method == 'GET':
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        # Проверяем статус заказа перед удалением
        if order.status not in ['pending', 'cancelled']:
            return Response(
                {'error': 'Можно удалить только заказы со статусом "В обработке" или "Отменен"'},
                status=400
            )
        order.delete()
        return Response(status=204)
    
    elif request.method == 'PATCH':
        items_data = request.data.get('items', [])
        
        try:
            with transaction.atomic():
                # Обновляем количество для каждого товара
                for item_data in items_data:
                    try:
                        item = OrderItem.objects.get(
                            order=order,
                            id=item_data['id']
                        )
                        new_quantity = int(item_data['quantity'])
                        
                        if new_quantity <= 0:
                            # Если количество 0 или меньше, удаляем товар
                            item.delete()
                        else:
                            item.quantity = new_quantity
                            item.save()
                        
                    except (OrderItem.DoesNotExist, KeyError):
                        continue
                
                # Проверяем, остались ли товары в заказе
                remaining_items = order.orderitem_set.count()
                if remaining_items == 0:
                    # Если товаров не осталось, удаляем весь заказ
                    order.delete()
                    return Response(status=204)
                
                # Пересчитываем общую стоимость заказа
                total_cost = sum(item.get_cost() for item in order.orderitem_set.all())
                
                # Обновляем total_cost через update() и перезагружаем объект
                Order.objects.filter(id=order.id).update(total_cost=total_cost)
                order.refresh_from_db()
                
                serializer = OrderSerializer(order, context={'request': request})
                return Response(serializer.data)
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=400
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data) 