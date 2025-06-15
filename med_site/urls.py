from django.contrib import admin
from django.urls import path, include
from shop.views import (
    home, product_detail, honey_products, products_with_image, 
    expensive_products, signup, contact_view, feedback_view, 
    add_review, cart_detail, add_to_cart, remove_from_cart
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

    #контрольная (не относится к готовму сайту)
    path('asexam/', views.asexam_view, name='asexam'),
    
    #Раздел О нас
    path('about/', views.about, name='about'),

    #Категории хедер
    path('products/type/<str:type>/', views.products_by_type, name='product_type'),

    #Корзина
    path('cart/', cart_detail, name='cart_detail'),
    path('cart/add/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:product_id>/', remove_from_cart, name='remove_from_cart'),

    # Формы обратной связи
    path('contact/', contact_view, name='contact'),
    path('feedback/', feedback_view, name='feedback'),
    path('product/<int:product_id>/review/', add_review, name='add_review'),
    path('search/', views.search, name='search'),

    # API URLs (основные для SPA)
    path('api/', include('shop.api_urls')),
    path('api-auth/', include('rest_framework.urls')),

    # Старые Django views (для совместимости)
    path('django/', views.home, name='django_home'),
    path('django/about/', views.about, name='django_about'),
    path('django/contact/', views.contact_view, name='django_contact'),
    path('django/asexam/', views.asexam_view, name='django_asexam'),
]

# Медиафайлы и статические файлы должны работать всегда
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Для разработки также добавляем STATICFILES_DIRS
if settings.DEBUG:
    urlpatterns += static('/static/', document_root=settings.BASE_DIR / 'shop/static')
    urlpatterns += [path('__debug__/', include('debug_toolbar.urls'))]