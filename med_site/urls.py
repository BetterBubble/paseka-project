from django.contrib import admin
from django.urls import path, include
from shop.views import home, product_detail, honey_products, products_with_image, expensive_products, signup
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

    path('asexam/', views.asexam_view, name='asexam'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)