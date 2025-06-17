from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from django.utils.text import slugify
import secrets

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
    slug = models.SlugField("URL", max_length=100, blank=True, null=True)
    description = models.TextField("Описание", blank=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


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
    slug = models.SlugField("URL", max_length=200, blank=True, null=True)
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
    updated = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    available = models.BooleanField("Доступен", default=True)
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
        return reverse('product_detail', kwargs={'pk': self.pk})

    def get_discount_percentage(self):
        if self.discount_price and self.price:
            discount = self.price - self.discount_price
            return int((discount / self.price) * 100)
        return 0
    
    @property
    def stock(self):
        return self.stock_quantity
    
    @property
    def created(self):
        return self.created_at
    
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Создана")
    
    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
    
    def __str__(self):
        return f"Корзина {self.user.username}"
    
    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE, verbose_name="Корзина")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField("Количество", default=1)
    
    class Meta:
        verbose_name = "Товар в корзине"
        verbose_name_plural = "Товары в корзине"
        unique_together = ('cart', 'product')
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
    
    def get_total_price(self):
        price = self.product.discount_price or self.product.price
        return price * self.quantity

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
    total_price = models.DecimalField("Сумма", max_digits=10, decimal_places=2, default=0)
    products = models.ManyToManyField(
        Product,
        through='OrderItem',
        through_fields=('order', 'product'),
        verbose_name="Товары в заказе"
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ #{self.id} от {self.user}"

    def calculate_total(self):
        """Подсчет общей суммы заказа"""
        return sum(item.get_cost() for item in self.orderitem_set.all())

    def save(self, *args, **kwargs):
        # Не пытаемся вычислить total_price при создании заказа
        # так как товары ещё не добавлены. Это будет сделано в сериализаторе.
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, verbose_name="Заказ", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, verbose_name="Товар", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField("Количество")
    price_at_purchase = models.DecimalField("Цена на момент покупки", max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        verbose_name = "Товар в заказе"
        verbose_name_plural = "Товары в заказе"

    def __str__(self):
        return f"{self.product} x{self.quantity}"

    def save(self, *args, **kwargs):
        # Автоматически устанавливаем цену при создании, если она не задана
        if self.price_at_purchase is None and self.product:
            self.price_at_purchase = self.product.discount_price or self.product.price
        super().save(*args, **kwargs)

    def get_cost(self):
        """Получить стоимость позиции"""
        return self.price_at_purchase * self.quantity


class Review(models.Model):
    product = models.ForeignKey("Product", verbose_name="Товар", on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('auth.User', verbose_name="Пользователь", on_delete=models.CASCADE)
    rating = models.IntegerField("Оценка", choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField("Комментарий", blank=True)
    created_at = models.DateTimeField("Дата", auto_now_add=True)

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

    def __str__(self):
        return f"{self.user} о {self.product}"
    
    @property
    def created(self):
        return self.created_at

class Contact(models.Model):
    name = models.CharField("Имя", max_length=100)
    email = models.EmailField("Email")
    subject = models.CharField("Тема", max_length=200)
    message = models.TextField("Сообщение")
    created_at = models.DateTimeField("Дата отправки", auto_now_add=True)
    is_processed = models.BooleanField("Обработано", default=False)

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} от {self.name}"


class Feedback(models.Model):
    FEEDBACK_TYPES = [
        ('suggestion', 'Предложение по улучшению'),
        ('complaint', 'Жалоба'),
        ('question', 'Вопрос о продукции'),
        ('other', 'Другое')
    ]

    name = models.CharField("Имя", max_length=100)
    email = models.EmailField("Email")
    feedback_type = models.CharField(
        "Тип обращения",
        max_length=20,
        choices=FEEDBACK_TYPES
    )
    message = models.TextField("Сообщение")
    created_at = models.DateTimeField("Дата отправки", auto_now_add=True)
    is_processed = models.BooleanField("Обработано", default=False)
    response = models.TextField("Ответ", blank=True)
    responded_at = models.DateTimeField("Дата ответа", null=True, blank=True)

    class Meta:
        verbose_name = "Обратная связь"
        verbose_name_plural = "Обратная связь"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_feedback_type_display()} от {self.name}"

    def mark_as_responded(self, response_text):
        self.response = response_text
        self.is_processed = True
        self.responded_at = timezone.now()
        self.save()

class AuthToken(models.Model):
    """Модель для токенов авторизации"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auth_tokens')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            from django.utils import timezone
            from datetime import timedelta
            self.expires_at = timezone.now() + timedelta(days=7)  # Токен действует 7 дней
        super().save(*args, **kwargs)
    
    def is_valid(self):
        from django.utils import timezone
        return timezone.now() < self.expires_at
    
    class Meta:
        db_table = 'shop_auth_token'
    
    def __str__(self):
        return f"Token for {self.user.username}"
