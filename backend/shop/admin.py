from django.contrib import admin
from .models import Category, Manufacturer, Region, Product
from .models import Order, OrderItem, Review, DeliveryMethod
from .models import asexam
from .models import Contact, Feedback
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import letter, A4
import os

# Регистрируем шрифт для поддержки кириллицы
try:
    # Пытаемся использовать системный шрифт
    font_path = None
    # Различные пути для разных ОС
    possible_fonts = [
        '/System/Library/Fonts/Arial.ttf',  # macOS
        '/System/Library/Fonts/Helvetica.ttc',  # macOS
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',  # Linux
        'C:/Windows/Fonts/arial.ttf',  # Windows
    ]
    
    for font in possible_fonts:
        if os.path.exists(font):
            font_path = font
            break
    
    if font_path:
        pdfmetrics.registerFont(TTFont('Arial-Unicode', font_path))
        FONT_NAME = 'Arial-Unicode'
    else:
        # Если не можем найти TTF шрифт, используем встроенный шрифт с транслитерацией
        FONT_NAME = 'Helvetica'
except:
    FONT_NAME = 'Helvetica'

def transliterate(text):
    """Простая транслитерация для случаев, когда нет подходящего шрифта"""
    cyrillic_to_latin = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }
    result = ''
    for char in text:
        result += cyrillic_to_latin.get(char, char)
    return result

@admin.register(asexam)
class AsexamAdmin(admin.ModelAdmin):
    list_display = ("title", "exam_date", "created_at", "is_public")
    search_fields = ("title", "users__email")
    list_filter = ("is_public", "created_at", "exam_date")
    filter_horizontal = ("users",) 

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ("name", "website", "has_website")
    search_fields = ("name", "description")
    list_filter = ("name",)
    
    @admin.display(description="Есть сайт", boolean=True)
    def has_website(self, obj):
        return bool(obj.website)
    
    def get_readonly_fields(self, request, obj=None):
        # Если есть сайт, покажем ссылку
        if obj and obj.website:
            return []
        return []


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock_quantity", "category", 'product_type', "region", "has_manual")
    list_filter = ("category", 'product_type', "region", "manufacturer")
    search_fields = ("name", "description")
    raw_id_fields = ("category", "region", "manufacturer")
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'description', 'category', 'manufacturer', 'region', 'product_type')
        }),
        ('Цены и склад', {
            'fields': ('price', 'discount_price', 'stock_quantity', 'available')
        }),
        ('Медиа файлы', {
            'fields': ('image', 'manual'),
            'description': 'Изображение товара и инструкция по использованию'
        }),
        ('Системные поля', {
            'fields': ('created_at', 'updated'),
            'classes': ('collapse',)
        })
    )
    readonly_fields = ('created_at', 'updated')
    
    @admin.display(description="Есть инструкция", boolean=True)
    def has_manual(self, obj):
        return bool(obj.manual)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    fields = ('product', 'quantity', 'price_at_purchase', 'total_cost')
    readonly_fields = ('total_cost',)
    
    def get_readonly_fields(self, request, obj=None):
        # Делаем price_at_purchase readonly только для существующих записей
        readonly = list(self.readonly_fields)
        if obj and obj.pk:
            readonly.append('price_at_purchase')
        return readonly
    
    @admin.display(description="Стоимость")
    def total_cost(self, obj):
        if obj.pk:
            return f"{obj.get_cost()} ₽"
        return "-"
    
    def save_model(self, request, obj, form, change):
        # Автоматически устанавливаем price_at_purchase при создании
        if not obj.pk and obj.product:
            obj.price_at_purchase = obj.product.discount_price or obj.product.price
        super().save_model(request, obj, form, change)


@admin.action(description="Скачать выбранные заказы в PDF")
def download_orders_pdf(modeladmin, request, queryset):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 50  # Начинаем сверху
    
    # Устанавливаем шрифт
    p.setFont(FONT_NAME, 12)
    
    # Заголовок
    title = "Отчет по заказам" if FONT_NAME == 'Arial-Unicode' else transliterate("Отчет по заказам")
    p.drawString(50, y, title)
    y -= 30
    
    for order in queryset:
        # Проверяем, помещается ли заказ на странице
        if y < 150:
            p.showPage()
            p.setFont(FONT_NAME, 12)
            y = height - 50
        
        # Информация о заказе
        order_info = [
            f"Заказ #{order.id} от {order.user}" if FONT_NAME == 'Arial-Unicode' 
            else f"Order #{order.id} from {order.user}",
            
            f"Дата: {order.created_at.strftime('%Y-%m-%d %H:%M')}" if FONT_NAME == 'Arial-Unicode'
            else f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}",
            
            f"Статус: {order.get_status_display()}" if FONT_NAME == 'Arial-Unicode'
            else f"Status: {transliterate(order.get_status_display())}",
            
            f"Сумма: {order.total_price} руб." if FONT_NAME == 'Arial-Unicode'
            else f"Total: {order.total_price} RUB",
            
            f"Товары:" if FONT_NAME == 'Arial-Unicode' else "Products:"
        ]
        
        for info in order_info:
            p.drawString(50, y, info)
            y -= 20
        
        # Товары в заказе
        for item in order.orderitem_set.all():
            if y < 50:
                p.showPage()
                p.setFont(FONT_NAME, 12)
                y = height - 50
                
            if FONT_NAME == 'Arial-Unicode':
                item_text = f"  - {item.product.name} x{item.quantity} ({item.price_at_purchase} руб.)"
            else:
                item_text = f"  - {transliterate(item.product.name)} x{item.quantity} ({item.price_at_purchase} RUB)"
            
            p.drawString(70, y, item_text)
            y -= 15
        
        y -= 20  # Отступ между заказами
    
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='orders_report.pdf')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user_name", "created_at", "status", "total_price", "item_count")
    list_filter = ("status", "delivery_method")
    date_hierarchy = "created_at"
    raw_id_fields = ("user",)
    readonly_fields = ("created_at",)
    inlines = [OrderItemInline]
    actions = [download_orders_pdf]

    def save_related(self, request, form, formsets, change):
        """Пересчитываем total_price после сохранения связанных объектов"""
        super().save_related(request, form, formsets, change)
        # Пересчитываем общую сумму заказа
        order = form.instance
        total = sum(item.get_cost() for item in order.orderitem_set.all())
        order.total_price = total
        order.save()

    @admin.display(description="Пользователь")
    def user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user.first_name else obj.user.username

    @admin.display(description="Кол-во товаров")
    def item_count(self, obj):
        return obj.orderitem_set.count()


@admin.register(DeliveryMethod)
class DeliveryMethodAdmin(admin.ModelAdmin):
    list_display = ("name", "cost_policy")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "created_at")
    search_fields = ("comment",)
    list_filter = ("rating", "created_at")
    raw_id_fields = ("product", "user")
    @admin.display(description="Краткий отзыв")
    def short_comment(self, obj):
        return (obj.comment[:40] + "...") if len(obj.comment) > 40 else obj.comment

    list_display = ("product", "user", "rating", "short_comment", "created_at")


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'created_at', 'is_processed')
    list_filter = ('is_processed', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('feedback_type', 'name', 'email', 'created_at', 'is_processed')
    list_filter = ('feedback_type', 'is_processed', 'created_at')
    search_fields = ('name', 'email', 'message', 'response')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Информация о пользователе', {
            'fields': ('name', 'email')
        }),
        ('Обращение', {
            'fields': ('feedback_type', 'message', 'created_at')
        }),
        ('Обработка', {
            'fields': ('is_processed', 'response', 'responded_at')
        }),
    )
