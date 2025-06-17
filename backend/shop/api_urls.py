from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    CategoryViewSet, ProductViewSet, CartViewSet, 
    OrderViewSet, ReviewViewSet, UserViewSet, DeliveryMethodViewSet
)
from . import views

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'user', UserViewSet, basename='user')
router.register(r'delivery-methods', DeliveryMethodViewSet, basename='delivery-method')

urlpatterns = [
    path('', include(router.urls)),
    path('csrf-token/', views.get_csrf_token, name='api_csrf_token'),
    path('register/', views.register_user, name='api_register'),
    path('login/', views.login_user, name='api_login'),
    path('logout/', views.logout_user, name='api_logout'),
    path('current-user/', views.current_user, name='api_current_user'),
] 