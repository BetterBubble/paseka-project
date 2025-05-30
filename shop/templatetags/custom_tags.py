from django import template
from shop.models import Product

register = template.Library()

@register.filter
def multiply(value, arg):
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return ''

@register.inclusion_tag('shop/partials/latest_products.html')
def show_latest_products(count=3):
    latest = Product.objects.order_by('-id')[:count]
    return {'latest_products': latest}
