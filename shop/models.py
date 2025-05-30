from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User

class asexam(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название экзамена")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания записи")
    exam_date = models.DateField(verbose_name="Дата проведения экзамена")
    image = models.ImageField(upload_to='exam_images/', blank=True, null=True, verbose_name="Изображение задания")
    users = models.ManyToManyField(User, related_name="asexams", verbose_name="Пользователи, пишущие экзамен")
    is_public = models.BooleanField(default=False, verbose_name="Опубликовано")

    def __str__(self):
        return self.title

class ProductManager(models.Manager):
    def available(self):
        return self.filter(stock_quantity__gt=0)

class Category(models.Model):
    name = models.CharField("Название категории", max_length=100)
    description = models.TextField("Описание", blank=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    name = models.CharField("Название производителя", max_length=100)
    description = models.TextField("Описание", blank=True)

    class Meta:
        verbose_name = "Производитель"
        verbose_name_plural = "Производители"

    def __str__(self):
        return self.name


class Region(models.Model):
    name = models.CharField("Регион", max_length=100)

    class Meta:
        verbose_name = "Регион"
        verbose_name_plural = "Регионы"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField("Название товара", max_length=200)
    description = models.TextField("Описание")
    price = models.DecimalField("Цена", max_digits=10, decimal_places=2)
    discount_price = models.DecimalField("Цена со скидкой", max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField("Количество на складе", default=0)
    image = models.ImageField("Изображение", upload_to="products/", blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name='Категория')
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE, related_name='products', verbose_name='Производитель')
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='products', verbose_name='Регион')
    objects = ProductManager()
    created_at = models.DateTimeField(default=timezone.now, verbose_name='Дата добавления')
    PRODUCT_TYPES = [
        ('honey', 'Мёд'),
        ('comb', 'Соты'),
        ('propolis', 'Прополис'),
        ('bee_pollen', 'Пыльца'),
        ('wax', 'Воск'),
    ]
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPES,
        default='honey',
        verbose_name='Вид продукции'
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('product_detail', args=[str(self.id)])

    def get_absolute_url(self):
        return reverse('product_detail', kwargs={'pk': self.pk})

class DeliveryMethod(models.Model):
    name = models.CharField("Способ доставки", max_length=100)
    cost_policy = models.CharField("Политика стоимости", max_length=100)

    class Meta:
        verbose_name = "Способ доставки"
        verbose_name_plural = "Способы доставки"

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'В ожидании'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
    ]

    user = models.ForeignKey('auth.User', verbose_name="Пользователь", on_delete=models.CASCADE)
    created_at = models.DateTimeField("Дата заказа", auto_now_add=True)
    delivery_address = models.CharField("Адрес доставки", max_length=255)
    delivery_method = models.ForeignKey(DeliveryMethod, verbose_name="Способ доставки", on_delete=models.SET_NULL, null=True)
    status = models.CharField("Статус", max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField("Сумма", max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ #{self.id} от {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, verbose_name="Заказ", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", verbose_name="Товар", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField("Количество")
    price_at_purchase = models.DecimalField("Цена на момент покупки", max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Товар в заказе"
        verbose_name_plural = "Товары в заказе"

    def __str__(self):
        return f"{self.product} x{self.quantity}"


class Review(models.Model):
    product = models.ForeignKey("Product", verbose_name="Товар", on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', verbose_name="Пользователь", on_delete=models.CASCADE)
    rating = models.IntegerField("Оценка", choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField("Комментарий", blank=True)
    created_at = models.DateTimeField("Дата", auto_now_add=True)

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

    def __str__(self):
        return f"{self.user} о {self.product}"
