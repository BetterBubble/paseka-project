from django.contrib import admin
from .models import Category, Manufacturer, Region, Product
from .models import Order, OrderItem, Review, DeliveryMethod
from .models import asexam

@admin.register(asexam)
class AsexamAdmin(admin.ModelAdmin):
    list_display = ("title", "exam_date", "created_at", "is_public")
    list_filter = ("is_public", "exam_date")
    search_fields = ("title",)
    filter_horizontal = ("users",)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock_quantity", "category", 'product_type', "region")
    list_filter = ("category", 'product_type', "region", "manufacturer")
    search_fields = ("name", "description")
    raw_id_fields = ("category", "region", "manufacturer")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ("price_at_purchase",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user_name", "created_at", "status", "total_price", "item_count")
    list_filter = ("status", "delivery_method")
    date_hierarchy = "created_at"
    raw_id_fields = ("user",)
    readonly_fields = ("created_at", "total_price")
    inlines = [OrderItemInline]

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
