"""
Контекстные процессоры для работы с корзиной.
Предоставляют глобальный контекст для шаблонов Django.
"""
from .cart import Cart

def cart_context(request):
    """
    Контекстный процессор для получения общего количества товаров в корзине.

    Args:
        request: объект запроса Django

    Returns:
        dict: словарь с количеством товаров в корзине
    """
    cart = Cart(request)
    return {'cart_total_items': len(cart)}
