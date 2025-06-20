from django.contrib import admin
from django.urls import path, include
from shop.views import (
    home, product_detail, honey_products, products_with_image, 
    expensive_products, signup, contact_view, feedback_view, 
    add_review, cart_detail, add_to_cart, remove_from_cart,
    ProductListView, ProductDetailView, CategoryListView, ManufacturerListView,
    cart_view, update_cart, clear_cart, create_order, register_user as register_api, 
    login_user as login_api, logout_user as logout_api,
    current_user, set_language_api, remove_from_cart_api
)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from shop import views

urlpatterns = [
    path('', home, name='index'),
    path('product/<int:pk>/', product_detail, name='product_detail'),
    path('admin/', admin.site.urls),
    path('honey/', honey_products, name='honey'),
    path('with-image/', products_with_image, name='with_image'),
    path('expensive/', expensive_products, name='expensive'),

    # Авторизация (вход и выход)
    path('accounts/login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(next_page='index'), name='logout'),

    # Регистрация
    path('signup/', signup, name='signup'),

    # Важно: подключаем все стандартные маршруты Django auth (в т.ч. password_change, password_reset и др.)
    path('accounts/', include('django.contrib.auth.urls')),

    # Раздел О нас
    path('about/', views.about, name='about'),

    # Категории хедер
    path('products/type/<str:type>/', views.products_by_type, name='product_type'),

    # Корзина
    path('cart/', cart_detail, name='cart_detail'),
    path('cart/add/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:product_id>/', remove_from_cart, name='remove_from_cart'),

    # Формы обратной связи
    path('contact/', contact_view, name='contact'),
    path('feedback/', feedback_view, name='feedback'),
    path('product/<int:product_id>/review/', add_review, name='add_review'),
    path('search/', views.search, name='search'),
    path('search/complex/', views.search_complex_products, name='search_complex'),
    path('special-offers/', views.find_special_offers, name='special_offers'),

    # API URLs (основные для SPA) - ДОЛЖНО БЫТЬ ПЕРВЫМ!
    path('api/', include('shop.api_urls')),
    
    # Дополнительные API endpoints
    path('api/', include([
        path('register/', register_api, name='api_register'),
        path('login/', login_api, name='api_login'),
        path('logout/', logout_api, name='api_logout'),
        path('current-user/', current_user, name='api_current_user'),
    ])),

    # Совместимость для некоторых старых API views (сессионные, не для авторизованных пользователей)
    path('api/session/', include([
        path('cart/', cart_view, name='api_cart_session'),
        path('cart/add/', views.add_to_cart_api, name='api_add_to_cart_session'),
        path('cart/remove/', remove_from_cart_api, name='api_remove_from_cart_session'),
        path('cart/update/', update_cart, name='api_update_cart_session'),
        path('cart/clear/', clear_cart, name='api_clear_cart_session'),
        path('orders/', create_order, name='api_create_order'),
        path('set-language/', set_language_api, name='api_set_language'),
    ])),

    # Старые Django views (для совместимости)
    path('django/', views.home, name='django_home'),
    path('django/about/', views.about, name='django_about'),
    path('django/contact/', views.contact_view, name='django_contact'),
]

# Медиафайлы и статические файлы должны работать всегда
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Для разработки также добавляем STATICFILES_DIRS
if settings.DEBUG:
    urlpatterns += static('/static/', document_root=settings.BASE_DIR / 'shop/static')
    urlpatterns += [path('__debug__/', include('debug_toolbar.urls'))]