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
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    product_price = serializers.DecimalField(source='price_at_purchase', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'product_price', 'quantity', 'total_price']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None
        
    def get_total_price(self, obj):
        return obj.price_at_purchase * obj.quantity

class DeliveryMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryMethod
        fields = ['id', 'name', 'cost_policy']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    delivery_method_name = serializers.CharField(source='delivery_method.name', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'total_cost', 'status', 'status_display', 
                 'delivery_method', 'delivery_method_name', 'address', 'created_at', 'full_name']
        read_only_fields = ['user', 'total_cost', 'created_at']

    def create(self, validated_data):
        logger = logging.getLogger(__name__)
        
        try:
            user = self.context['request'].user
            items_data = self.context['request'].data.get('items', [])
            
            logger.info(f"Creating order for user: {user}, items: {items_data}")
            
            # Создаём заказ без total_cost (будет вычислена ниже)
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
            order.total_cost = total_price
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