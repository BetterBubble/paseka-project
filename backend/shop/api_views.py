# Стандартные библиотеки Python
import logging
from decimal import Decimal

# Сторонние библиотеки
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

# Локальные импорты
from .models import (
    Category, Product, Cart, CartItem, Order,
    OrderItem, Review, DeliveryMethod, Manufacturer, Region
)
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer,
    CartItemSerializer, OrderSerializer, ReviewSerializer,
    UserSerializer, DeliveryMethodSerializer, ManufacturerSerializer, RegionSerializer
)
from .authentication import BearerTokenAuthentication

# Настройка логгера
logger = logging.getLogger(__name__)
User = get_user_model()

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра категорий товаров. Только для чтения."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с товарами."""
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]

    def get_queryset(self):
        """
        Переопределяем queryset для фильтрации товаров.
        Поддерживает фильтрацию по категории и поиск по названию.
        """
        # Показываем все товары, независимо от доступности
        queryset = Product.objects.all()

        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def create(self, request, *args, **kwargs):
        """Создание нового товара"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def reviews(self, request, **kwargs):
        """Получение всех отзывов для конкретного товара."""
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с корзиной пользователя."""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]

    def get_queryset(self):
        """Получение корзины текущего пользователя."""
        return Cart.objects.filter(user=self.request.user)

    def list(self, request):
        """Получение или создание корзины пользователя."""
        cart = Cart.objects.get_or_create(user=request.user)[0]
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    def get_object(self):
        """Получение объекта корзины текущего пользователя."""
        cart = Cart.objects.get_or_create(user=self.request.user)[0]
        return cart

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """
        Добавление товара в корзину.
        Если товар уже есть в корзине, увеличивает его количество.
        """
        cart = Cart.objects.get_or_create(user=request.user)[0]
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
            
            # Проверяем доступность товара
            if not product.available or product.stock_quantity <= 0:
                return Response(
                    {'error': 'Товар недоступен для заказа'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Проверяем достаточность количества
            if product.stock_quantity < quantity:
                return Response(
                    {'error': f'Доступно только {product.stock_quantity} единиц товара'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Product.DoesNotExist:
            return Response(
                {'error': 'Товар не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # Проверяем, не превысит ли новое количество доступный остаток
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock_quantity:
                return Response(
                    {'error': f'В корзине уже есть {cart_item.quantity} единиц товара. Доступно для добавления еще {product.stock_quantity - cart_item.quantity} единиц'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Удаление товара из корзины."""
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
        """
        Обновление количества товара в корзине.
        Если количество <= 0, товар удаляется из корзины.
        """
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
        """Очистка корзины - удаление всех товаров."""
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с заказами."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]

    def get_queryset(self):
        """Получение списка заказов текущего пользователя."""
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        """
        Создание нового заказа.
        Обрабатывает различные типы ошибок и логирует их.
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            order = serializer.save()

            return Response(
                self.get_serializer(order).data,
                status=status.HTTP_201_CREATED
            )
        except (ValueError, KeyError) as e:
            logger.error("Ошибка при создании заказа: %s", str(e), exc_info=True)
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error("Непредвиденная ошибка при создании заказа: %s", str(e), exc_info=True)
            return Response(
                {'error': 'Внутренняя ошибка сервера'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def partial_update(self, request, *args, **kwargs):
        """
        Частичное обновление заказа.
        Поддерживает обновление количества товаров и пересчет общей стоимости.
        """
        try:
            order = self.get_object()
            items_data = request.data.get('items', [])

            serializer = self.get_serializer(order, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            remaining_item_ids = [item['id'] for item in items_data if int(item.get('quantity', 0)) > 0]

            with transaction.atomic():
                # Удаляем товары, которых нет в списке remaining_item_ids
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
                        logger.warning("Ошибка при обновлении товара в заказе: %s", str(e))
                        continue

                # Проверяем, остались ли товары в заказе
                remaining_items = order.orderitem_set.count()
                if remaining_items == 0:
                    order.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)

                # Пересчитываем общую стоимость заказа
                total_cost = Decimal('0')
                for item in order.orderitem_set.all():
                    item_cost = item.get_cost()
                    total_cost += item_cost

                Order.objects.filter(id=order.id).update(total_cost=total_cost)
                order.refresh_from_db()

                serializer = self.get_serializer(order)
                return Response(serializer.data)

        except (ValueError, KeyError) as e:
            logger.error("Ошибка при обновлении заказа: %s", str(e), exc_info=True)
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error("Непредвиденная ошибка при обновлении заказа: %s", str(e), exc_info=True)
            return Response(
                {'error': 'Внутренняя ошибка сервера'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с отзывами."""
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [BearerTokenAuthentication]

    def get_queryset(self):
        """
        Получение списка отзывов.
        Поддерживает фильтрацию по конкретному товару.
        """
        product_id = self.request.query_params.get('product')
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        """Создание отзыва с автоматическим указанием пользователя."""
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для работы с пользователями. Только для чтения."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [BearerTokenAuthentication]

    def get_queryset(self):
        """Получение данных только текущего пользователя."""
        return User.objects.filter(id=self.request.user.id)

class DeliveryMethodViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра методов доставки. Только для чтения."""
    queryset = DeliveryMethod.objects.all()
    serializer_class = DeliveryMethodSerializer

class CategoryListAPIView(generics.ListAPIView):
    """API для получения списка категорий."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ManufacturerListAPIView(generics.ListAPIView):
    """API для получения списка производителей без пагинации."""
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer
    pagination_class = None  # Отключаем пагинацию

class RegionListAPIView(generics.ListAPIView):
    """API для получения списка регионов без пагинации."""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    pagination_class = None  # Отключаем пагинацию

@api_view(['GET', 'DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    """
    Представление для детального просмотра, удаления и обновления заказа.
    Поддерживает методы GET, DELETE и PATCH.
    """
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Заказ не найден'}, status=404)

    if request.method == 'GET':
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)

    if request.method == 'DELETE':
        if order.status not in ['pending', 'cancelled']:
            return Response(
                {'error': 'Можно удалить только заказы со статусом "В обработке" или "Отменен"'},
                status=400
            )
        order.delete()
        return Response(status=204)

    if request.method == 'PATCH':
        items_data = request.data.get('items', [])

        try:
            with transaction.atomic():
                # Обновляем каждый товар в заказе
                for item_data in items_data:
                    try:
                        item = OrderItem.objects.get(
                            order=order,
                            id=item_data['id']
                        )
                        new_quantity = int(item_data['quantity'])

                        if new_quantity <= 0:
                            item.delete()
                        else:
                            item.quantity = new_quantity
                            item.save()
                    except (OrderItem.DoesNotExist, KeyError):
                        continue

                # Проверяем, остались ли товары в заказе
                remaining_items = order.orderitem_set.count()
                if remaining_items == 0:
                    order.delete()
                    return Response(status=204)

                # Пересчитываем общую стоимость заказа
                total_cost = sum(item.get_cost() for item in order.orderitem_set.all())

                Order.objects.filter(id=order.id).update(total_cost=total_cost)
                order.refresh_from_db()

                serializer = OrderSerializer(order, context={'request': request})
                return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=400
            )

    return Response({'error': 'Неподдерживаемый метод'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request):
    """Получение списка всех заказов пользователя."""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)
