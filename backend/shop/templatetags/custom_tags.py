from django import template
from django.db.models import QuerySet
from decimal import Decimal
from shop.models import Product

register = template.Library()

@register.filter
def subtract(value, arg):
    """Вычитает arg из value"""
    try:
        return value - arg
    except (TypeError, ValueError):
        return value

@register.filter
def percentage(value, total):
    """Вычисляет процент value от total"""
    try:
        if isinstance(value, (int, float, Decimal)) and isinstance(total, (int, float, Decimal)):
            if total != 0:
                return round((value / total) * 100)
    except (TypeError, ValueError):
        pass
    return 0

@register.inclusion_tag('shop/latest_products.html')
def show_latest_products(count=3):
    """Показывает последние добавленные товары"""
    latest_products = Product.objects.order_by('-created_at')[:count]
    return {'latest_products': latest_products}
