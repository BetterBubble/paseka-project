from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from shop.models import Category, Product, Manufacturer, Order, DeliveryMethod, Region, OrderItem
from shop.serializers import ProductSerializer
from decimal import Decimal
from django.contrib.auth import get_user_model

User = get_user_model()

class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Мед',
            slug='med'
        )
        self.manufacturer = Manufacturer.objects.create(
            name='Пасека'
        )
        self.region = Region.objects.create(
            name='Алтай'
        )
        self.product = Product.objects.create(
            name='Липовый мед',
            slug='lipoviy-med',
            category=self.category,
            manufacturer=self.manufacturer,
            region=self.region,
            price=Decimal('500.00'),
            stock_quantity=10,
            available=True
        )
        self.client.force_authenticate(user=self.user)

    def test_get_product_list(self):
        url = reverse('product-list')
        response = self.client.get(url)
        products = Product.objects.filter(available=True)
        serializer = ProductSerializer(products, many=True, context={'request': response.wsgi_request})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], serializer.data[0]['id'])
        self.assertEqual(response.data['results'][0]['name'], 'Липовый мед')

    def test_get_product_detail(self):
        url = reverse('product-detail', kwargs={'slug': self.product.slug})
        response = self.client.get(url)
        serializer = ProductSerializer(self.product, context={'request': response.wsgi_request})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], serializer.data['id'])
        self.assertEqual(response.data['name'], 'Липовый мед')
        self.assertEqual(response.data['price'], '500.00')
        self.assertEqual(response.data['stock'], 10)

    def test_filter_products_by_category(self):
        url = reverse('product-list')
        response = self.client.get(url, {'category': 'med'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], 'Липовый мед')

    def test_search_products(self):
        url = reverse('product-list')
        response = self.client.get(url, {'search': 'липовый'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], 'Липовый мед')

class OrderAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(name='Мед', slug='med')
        self.manufacturer = Manufacturer.objects.create(name='Пасека')
        self.region = Region.objects.create(name='Алтай')
        self.delivery_method = DeliveryMethod.objects.create(
            name='Курьер',
            cost_policy='{"base": 300, "per_km": 20}'
        )
        self.product = Product.objects.create(
            name='Липовый мед',
            slug='lipoviy-med',
            category=self.category,
            manufacturer=self.manufacturer,
            region=self.region,
            price=Decimal('500.00'),
            stock_quantity=10,
            available=True
        )
        self.client.force_authenticate(user=self.user)

    def test_create_order(self):
        url = reverse('order-list')
        data = {
            'full_name': 'Иван Иванов',
            'address': 'ул. Пчелиная, 1',
            'delivery_method': self.delivery_method.id,
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 2
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        order = Order.objects.first()
        self.assertEqual(order.orderitem_set.count(), 1)
        self.assertEqual(order.total_cost, Decimal('1000.00'))  # 500 * 2
        self.assertEqual(order.full_name, 'Иван Иванов')
        self.assertEqual(order.delivery_method, self.delivery_method)

    def test_get_user_orders(self):
        order = Order.objects.create(
            user=self.user,
            full_name='Иван Иванов',
            address='ул. Пчелиная, 1',
            delivery_method=self.delivery_method
        )
        
        url = reverse('order-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], order.id)
        self.assertEqual(response.data['results'][0]['full_name'], 'Иван Иванов')
        self.assertEqual(response.data['results'][0]['delivery_method'], self.delivery_method.id)

    def test_update_order(self):
        order = Order.objects.create(
            user=self.user,
            full_name='Иван Иванов',
            address='ул. Пчелиная, 1',
            delivery_method=self.delivery_method
        )
        order_item = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price_at_purchase=self.product.price
        )
        
        url = reverse('order-detail', kwargs={'pk': order.id})
        data = {
            'full_name': 'Петр Петров',
            'address': 'ул. Медовая, 2',
            'items': [
                {
                    'id': order_item.id,
                    'quantity': 3
                }
            ]
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.full_name, 'Петр Петров')
        self.assertEqual(order.address, 'ул. Медовая, 2')
        self.assertEqual(order.orderitem_set.first().quantity, 3)
        self.assertEqual(order.total_cost, Decimal('1500.00'))  # 500 * 3 