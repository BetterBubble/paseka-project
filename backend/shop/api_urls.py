from django.urls import path
from rest_framework.routers import DefaultRouter
from .api_views import (
    ProductViewSet,
    ReviewViewSet,
    CartViewSet,
    DeliveryMethodViewSet,
    OrderViewSet,
    UserViewSet,
    CategoryListAPIView,
    ManufacturerListAPIView,
    RegionListAPIView,
    order_detail
)
from . import views
from .views import price_statistics

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'delivery-methods', DeliveryMethodViewSet, basename='delivery-method')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = router.urls + [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('manufacturers/', ManufacturerListAPIView.as_view(), name='manufacturer-list'),
    path('regions/', RegionListAPIView.as_view(), name='region-list'),
    path('orders/<int:order_id>/', order_detail, name='order-detail'),
    path('login/', views.login_user, name='api_login'),
    path('logout/', views.logout_user, name='api_logout'),
    path('current-user/', views.current_user, name='api_current_user'),
    path('contact/', views.contact_view, name='api_contact'),
    path('price-statistics/', price_statistics, name='price_statistics'),
]
