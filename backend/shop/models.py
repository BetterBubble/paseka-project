from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
import secrets
from datetime import timedelta

class asexam(models.Model):
    title = models.CharField(max_length=255, verbose_name=_("Название экзамена"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Дата создания записи"))
    exam_date = models.DateField(verbose_name=_("Дата проведения экзамена"))
    image = models.ImageField(upload_to='exam_images/', blank=True, null=True, verbose_name=_("Изображение задания"))
    users = models.ManyToManyField(User, related_name="asexams", verbose_name=_("Пользователи, пишущие экзамен"))
    is_public = models.BooleanField(default=False, verbose_name=_("Опубликовано"))
    
    class Meta:
        verbose_name = _("Экзамен")
        verbose_name_plural = _("Экзамены")

    def __str__(self):
        return self.title

    @property
    def available(self):
        return self.is_public and self.exam_date >= timezone.now().date()

class ProductManager(models.Manager):
    def available(self):
        return self.filter(available=True)
    
    def get_cached_products(self):
        """Функциональный метод с использованием кеширования"""
        cache_key = 'available_products'
        products = cache.get(cache_key)
        if not products:
            products = list(self.available().select_related('category', 'manufacturer', 'region'))
            cache.set(cache_key, products, timeout=300)  # 5 минут
        return products

class Category(models.Model):
    name = models.CharField(_("Название категории"), max_length=100)
    slug = models.SlugField(_("URL"), max_length=100, blank=True, null=True)
    description = models.TextField(_("Описание"), blank=True)

    class Meta:
        verbose_name = _("Категория")
        verbose_name_plural = _("Категории")
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_product_count(self):
        """Функциональный метод - подсчет товаров в категории"""
        return self.products.filter(available=True).count()

class Manufacturer(models.Model):
    name = models.CharField(_("Название производителя"), max_length=100)
    description = models.TextField(_("Описание"), blank=True)
    website = models.URLField(_("Сайт производителя"), blank=True, null=True, help_text=_("Официальный сайт производителя"))

    class Meta:
        verbose_name = _("Производитель")
        verbose_name_plural = _("Производители")

    def __str__(self):
        return self.name
    
    def get_popular_products(self, limit=5):
        """Функциональный метод - получение популярных товаров производителя"""
        return self.products.filter(available=True).order_by('-created_at')[:limit]

class Region(models.Model):
    name = models.CharField(_("Регион"), max_length=100)

    class Meta:
        verbose_name = _("Регион")
        verbose_name_plural = _("Регионы")

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(_("Название товара"), max_length=200)
    slug = models.SlugField(_("URL"), max_length=200, blank=True, null=True)
    description = models.TextField(_("Описание"))
    price = models.DecimalField(_("Цена"), max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(_("Цена со скидкой"), max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(_("Количество на складе"), default=0)
    image = models.ImageField(_("Изображение"), upload_to="products/", blank=True, null=True)
    manual = models.FileField(_("Инструкция (PDF)"), upload_to="manuals/", blank=True, null=True, help_text=_("Инструкция по использованию продукта"))
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name=_('Категория'))
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE, related_name='products', verbose_name=_('Производитель'))
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='products', verbose_name=_('Регион'))
    objects = ProductManager()
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Дата добавления'))
    updated = models.DateTimeField(auto_now=True, verbose_name=_('Дата обновления'))
    available = models.BooleanField(_("Доступен"), default=True)
    PRODUCT_TYPES = [
        ('honey', _('Мёд')),
        ('comb', _('Соты')),
        ('propolis', _('Прополис')),
        ('bee_pollen', _('Пыльца')),
        ('wax', _('Воск')),
    ]
    product_type = models.CharField(
        _("Тип продукта"),
        max_length=20,
        choices=PRODUCT_TYPES,
        default='honey'
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Товар")
        verbose_name_plural = _("Товары")

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('product_detail', kwargs={'slug': self.slug})

    def get_discount_percentage(self):
        """Функциональный метод - расчет процента скидки"""
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
        """Функциональный метод - средний рейтинг товара"""
        reviews = self.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0
    
    def is_in_stock(self):
        """Функциональный метод - проверка наличия на складе"""
        return self.stock_quantity > 0 and self.available
    
    def get_final_price(self):
        """Функциональный метод - итоговая цена с учетом скидки"""
        return self.discount_price if self.discount_price else self.price
    
    def get_related_products(self, limit=4):
        """Функциональный метод - похожие товары"""
        return Product.objects.filter(
            category=self.category,
            available=True
        ).exclude(id=self.id)[:limit]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        # Очищаем кеш при сохранении товара
        cache.delete('available_products')
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
