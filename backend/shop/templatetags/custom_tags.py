"""
Пользовательские теги и фильтры для шаблонов Django.
Включает в себя математические операции и отображение товаров.
"""
from decimal import Decimal
from typing import Union, Dict, List

from django import template
from django.db.models import QuerySet

from shop.models import Product

register = template.Library()

@register.filter
def subtract(value: Union[int, float, Decimal], arg: Union[int, float, Decimal]) -> Union[int, float, Decimal]:
    """Вычитает arg из value.

    Args:
        value: Уменьшаемое число
        arg: Вычитаемое число

    Returns:
        Результат вычитания или исходное значение в случае ошибки
    """
    try:
        return value - arg
    except (TypeError, ValueError):
        return value

@register.filter
def percentage(value: Union[int, float, Decimal], total: Union[int, float, Decimal]) -> int:
    """Вычисляет процент value от total.

    Args:
        value: Значение для расчета процента
        total: Общее значение

    Returns:
        Процентное соотношение или 0 в случае ошибки
    """
    try:
        if isinstance(value, (int, float, Decimal)) and isinstance(total, (int, float, Decimal)):
            if total != 0:
                return round((value / total) * 100)
    except (TypeError, ValueError):
        pass
    return 0

@register.inclusion_tag('shop/latest_products.html')
def show_latest_products(count: int = 3) -> Dict[str, QuerySet[Product]]:
    """Показывает последние добавленные товары.

    Args:
        count: Количество товаров для отображения

    Returns:
        Словарь с QuerySet последних товаров
    """
    latest_products = Product.objects.order_by('-created_at')[:count]
    return {'latest_products': latest_products}
