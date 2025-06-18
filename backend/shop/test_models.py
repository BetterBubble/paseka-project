from django.test import TestCase
from django.core.exceptions import ValidationError
from shop.models import Category, Product, Manufacturer, Order, OrderItem, Region, User
from decimal import Decimal

class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Мед',
            slug='med',
            description='Натуральный мед'
        )

    def test_category_creation(self):
        self.assertTrue(isinstance(self.category, Category))
        self.assertEqual(str(self.category), 'Мед')

    def test_category_slug_unique(self):
        with self.assertRaises(ValidationError):
            Category.objects.create(
                name='Мед2',
                slug='med',
                description='Другой мед'
            ).full_clean()

class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Мед',
            slug='med'
        )
        self.manufacturer = Manufacturer.objects.create(
            name='Пасека',
            description='Лучшая пасека'
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
            description='Вкусный липовый мед',
            price=Decimal('500.00'),
            stock_quantity=10
        )

    def test_product_creation(self):
        self.assertTrue(isinstance(self.product, Product))
        self.assertEqual(str(self.product), 'Липовый мед')

    def test_product_price_validation(self):
        with self.assertRaises(ValidationError):
            self.product.price = Decimal('-100.00')
            self.product.full_clean()

    def test_product_stock_validation(self):
        with self.assertRaises(ValidationError):
            self.product.stock_quantity = -1
            self.product.full_clean()

    def test_apply_discount(self):
        # Применяем скидку 20%
        original_price = self.product.price
        discount_price = original_price * Decimal('0.8')
        self.product.discount_price = discount_price
        self.product.save()
        
        self.assertEqual(self.product.get_discount_percentage(), 20)
        self.assertEqual(self.product.get_final_price(), discount_price)

    def test_remove_discount(self):
        # Сначала применяем скидку
        original_price = self.product.price
        self.product.discount_price = original_price * Decimal('0.8')
        self.product.save()
        
        # Затем убираем скидку
        self.product.discount_price = None
        self.product.save()
        
        self.assertEqual(self.product.get_final_price(), original_price)
        self.assertEqual(self.product.get_discount_percentage(), 0)

    def test_invalid_discount_percentage(self):
        with self.assertRaises(ValidationError):
            self.product.discount_price = Decimal('-1.00')  # Скидка не может быть отрицательной
            self.product.full_clean()

class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        self.category = Category.objects.create(name='Мед', slug='med')
        self.manufacturer = Manufacturer.objects.create(name='Пасека')
        self.region = Region.objects.create(name='Алтай')
        self.product = Product.objects.create(
            name='Липовый мед',
            slug='lipoviy-med',
            category=self.category,
            manufacturer=self.manufacturer,
            region=self.region,
            price=Decimal('500.00'),
            stock_quantity=10
        )
        self.order = Order.objects.create(
            user=self.user,
            full_name='Иван Иванов',
            address='ул. Пчелиная, 1'
        )
        self.order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            price_at_purchase=self.product.price,
            quantity=2
        )
        self.order.update_total_cost()
        self.order.save()

    def test_order_creation(self):
        self.assertTrue(isinstance(self.order, Order))
        self.assertEqual(str(self.order), f'Заказ {self.order.id} от {self.user.username}')

    def test_order_total_cost(self):
        self.assertEqual(self.order.total_cost, Decimal('1000.00'))

    def test_order_item_creation(self):
        self.assertTrue(isinstance(self.order_item, OrderItem))
        self.assertEqual(self.order_item.get_cost(), Decimal('1000.00'))

    def test_export_to_csv(self):
        csv_data = self.order.export_to_csv()
        self.assertIn(self.order.full_name, csv_data)
        self.assertIn(str(self.order.total_cost), csv_data)
        self.assertIn(self.product.name, csv_data)

    def test_export_to_json(self):
        json_data = self.order.export_to_json()
        self.assertEqual(json_data['full_name'], self.order.full_name)
        self.assertEqual(Decimal(json_data['total_cost']), self.order.total_cost)
        self.assertEqual(len(json_data['items']), 1)
        self.assertEqual(json_data['items'][0]['product_name'], self.product.name) 