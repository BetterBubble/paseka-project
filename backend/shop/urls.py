"""
Конфигурация URL-путей для приложения магазина.
Включает пути для основных страниц, API и демонстрационных функций.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('feedback/', views.feedback_view, name='feedback'),
    path('search/', views.search_products, name='search'),
    path('product/<int:pk>/', views.product_detail, name='product_detail'),
    path('product/<int:pk>/add_review/', views.add_review, name='add_review'),
    path('cart/', views.cart_detail, name='cart_detail'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('order/create/', views.create_order, name='order_create'),
    path('order/<int:order_id>/', views.order_detail, name='order_detail'),
    path('register/', views.register, name='register'),
    path('signup/', views.signup, name='signup'),
    path('honey/', views.honey_products, name='honey_list'),
    path('products/with-image/', views.products_with_image, name='products_with_image'),
    path('products/expensive/', views.expensive_products, name='expensive_products'),
    path('products/altai/', views.altai_products, name='altai_products'),
    path('products/by-type/<str:product_type>/', views.products_by_type, name='products_by_type'),
    path('bulk-operations/', views.bulk_operations_demo, name='bulk_operations'),
    path('f-expressions/', views.f_expressions_demo, name='f_expressions'),
    path('upload/', views.upload_product_images, name='upload_form'),
    path('search/complex/', views.search_complex_products, name='search_complex'),
    path('search/special-offers/', views.find_special_offers, name='special_offers'),

    # API endpoints
    path('api/csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('api/register/', views.register_user, name='api_register'),
    path('api/login/', views.login_user, name='api_login'),
    path('api/current-user/', views.current_user, name='api_current_user'),
    path('api/logout/', views.logout_user, name='api_logout'),
    path('api/products/', views.ProductListView.as_view(), name='api_products'),
    path('api/products/<int:pk>/', views.ProductDetailView.as_view(), name='api_product_detail'),
    path('api/categories/', views.CategoryListView.as_view(), name='api_categories'),
    path('api/manufacturers/', views.ManufacturerListView.as_view(), name='api_manufacturers'),
    path('api/cart/', views.cart_view, name='api_cart'),
    path('api/cart/add/', views.add_to_cart_api, name='api_cart_add'),
    path('api/cart/update/', views.update_cart, name='api_cart_update'),
    path('api/cart/remove/', views.remove_from_cart_api, name='api_cart_remove'),
    path('api/cart/clear/', views.clear_cart, name='api_cart_clear'),
    path('api/set-language/', views.set_language_api, name='api_set_language'),

    # Обработка ошибок
    path(
        'product-404/<int:pk>/',
        views.product_detail_with_404,
        name='product_detail_404'
    ),
]
