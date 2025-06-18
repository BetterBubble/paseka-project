from django.urls import path
from rest_framework.routers import DefaultRouter
from .api_views import (
    ProductViewSet,
    CategoryViewSet,
    ReviewViewSet,
    ManufacturerListAPIView,
    CartViewSet,
    DeliveryMethodViewSet,
    OrderViewSet,
    order_detail
)
from . import views

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'delivery-methods', DeliveryMethodViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('manufacturers/', ManufacturerListAPIView.as_view(), name='manufacturer-list'),
    path('login/', views.login_user, name='api_login'),
    path('logout/', views.logout_user, name='api_logout'),
    path('current-user/', views.current_user, name='api_current_user'),
] + router.urls 