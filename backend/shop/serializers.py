from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Review, DeliveryMethod, Manufacturer
import logging

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ['id', 'name', 'description', 'website']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    manufacturer = ManufacturerSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    manual_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'discount_price', 
                 'image', 'image_url', 'manual', 'manual_url', 'category', 'manufacturer', 'stock', 'available', 'created', 'updated',
                 'average_rating', 'reviews_count']
    
    def get_average_rating(self, obj):
        return obj.average_rating()
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_manual_url(self, obj):
        if obj.manual:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.manual.url)
            return obj.manual.url
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']
    
    def get_total_price(self, obj):
        return obj.get_total_price()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'created', 'items', 'total_price']
    
    def get_total_price(self, obj):
        return obj.get_total_price()

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'created']
        read_only_fields = ['user', 'created']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_at_purchase']

class DeliveryMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryMethod
        fields = ['id', 'name', 'cost_policy']

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True, child=serializers.DictField(), required=False)
    full_name = serializers.CharField(write_only=True, required=False)
    delivery_method = serializers.PrimaryKeyRelatedField(queryset=DeliveryMethod.objects.all(), write_only=True, required=True)
    
    # Поля для чтения
    order_items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    delivery_method_info = DeliveryMethodSerializer(source='delivery_method', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'delivery_address', 'delivery_method', 
                 'delivery_method_info', 'total_price', 'items', 'full_name', 'order_items']
        read_only_fields = ['user', 'created_at', 'total_price']

    def to_representation(self, instance):
        """Переопределяем метод для корректного возврата данных заказа"""
        ret = super().to_representation(instance)
        # Удаляем write_only поля из ответа, но оставляем delivery_address
        ret.pop('items', None)
        ret.pop('full_name', None)
        ret.pop('delivery_method', None)  # Заменяется на delivery_method_info
        return ret

    def create(self, validated_data):
        logger = logging.getLogger(__name__)
        
        try:
            user = self.context['request'].user
            items_data = validated_data.pop('items', [])
            full_name = validated_data.pop('full_name', '')
            # Убираем total_price из validated_data если он там есть
            validated_data.pop('total_price', None)
            
            logger.info(f"Creating order for user: {user}, items: {items_data}")
            
            # Разделяем full_name на first_name и last_name (если возможно)
            if full_name:
                parts = full_name.strip().split(' ', 1)
                user.first_name = parts[0]
                if len(parts) > 1:
                    user.last_name = parts[1]
                user.save()
            
            # Создаём заказ без total_price (будет вычислена ниже)
            order = Order.objects.create(user=user, **validated_data)
            logger.info(f"Order created: {order.id}")
            
            # Создаём товары в заказе и подсчитываем общую сумму
            total_price = 0
            for item in items_data:
                product_id = item.get('product')
                quantity = item.get('quantity', 1)
                logger.info(f"Processing item: product_id={product_id}, quantity={quantity}")
                
                try:
                    product = Product.objects.get(id=product_id)
                    price_at_purchase = product.discount_price or product.price
                    logger.info(f"Product found: {product.name}, price: {price_at_purchase}")
                    
                    order_item = OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=price_at_purchase
                    )
                    logger.info(f"OrderItem created: {order_item.id}")
                    total_price += price_at_purchase * quantity
                except Product.DoesNotExist:
                    logger.warning(f"Product not found: {product_id}")
                    # Если товар не найден, пропускаем его
                    pass
            
            # Обновляем итоговую сумму заказа
            order.total_price = total_price
            order.save()
            logger.info(f"Order total updated: {total_price}")
            
            return order
            
        except Exception as e:
            logger.error(f"Error creating order: {str(e)}", exc_info=True)
            raise

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id'] 