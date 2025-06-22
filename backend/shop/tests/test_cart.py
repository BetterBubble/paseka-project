from django.test import TestCase, RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from shop.models import Category, Product, Manufacturer, Region
from shop.cart import Cart
from decimal import Decimal

class CartTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.category = Category.objects.create(
            name='Мед',
            slug='med'
        )
        self.manufacturer = Manufacturer.objects.create(
            name='Пасека'
        )
        self.region = Region.objects.create(
            name='Алтайский край'
        )
        self.product = Product.objects.create(
            name='Липовый мед',
            slug='lipoviy-med',
            category=self.category,
            manufacturer=self.manufacturer,
            region=self.region,
            price=Decimal('500.00'),
            stock_quantity=10
        )

        # Создаем запрос и добавляем сессию
        self.request = self.factory.get('/')
        middleware = SessionMiddleware(lambda x: None)
        middleware.process_request(self.request)
        self.request.session.save()

        # Инициализируем корзину
        self.cart = Cart(self.request)

    def test_add_product_to_cart(self):
        self.cart.add(self.product, quantity=2)

        self.assertEqual(len(self.cart), 1)
        self.assertEqual(self.cart.get_total_price(), Decimal('1000.00'))

    def test_remove_product_from_cart(self):
        self.cart.add(self.product, quantity=2)
        self.cart.remove(self.product)

        self.assertEqual(len(self.cart), 0)
        self.assertEqual(self.cart.get_total_price(), Decimal('0'))

    def test_update_product_quantity(self):
        self.cart.add(self.product, quantity=2)
        self.cart.add(self.product, quantity=3, update_quantity=True)

        product_id = str(self.product.id)
        self.assertEqual(self.cart.cart[product_id]['quantity'], 3)

    def test_get_total_price(self):
        self.cart.add(self.product, quantity=2)

        # Добавляем еще один продукт
        product2 = Product.objects.create(
            name='Гречишный мед',
            slug='grechishniy-med',
            category=self.category,
            manufacturer=self.manufacturer,
            region=self.region,
            price=Decimal('600.00'),
            stock_quantity=10
        )
        self.cart.add(product2, quantity=1)

        # Проверяем общую стоимость: (500 * 2) + (600 * 1) = 1600
        self.assertEqual(self.cart.get_total_price(), Decimal('1600.00'))

    def test_clear_cart(self):
        self.cart.add(self.product, quantity=2)
        self.cart.clear()

        self.assertEqual(len(self.cart), 0)

    def test_product_total_price(self):
        self.cart.add(self.product, quantity=3)
        product_id = str(self.product.id)

        # Проверяем стоимость конкретного товара: 500 * 3 = 1500
        self.assertEqual(
            Decimal(self.cart.cart[product_id]['total_price']),
            Decimal('1500.00')
        )

    def test_cart_iteration(self):
        self.cart.add(self.product, quantity=2)

        for item in self.cart:
            self.assertEqual(item['product'], self.product)
            self.assertEqual(item['quantity'], 2)
            self.assertEqual(item['price'], Decimal('500.00'))
            self.assertEqual(item['total_price'], Decimal('1000.00'))