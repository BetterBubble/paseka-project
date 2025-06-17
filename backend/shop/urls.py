from django.urls import path
from . import views
 
urlpatterns = [
    # ... existing patterns ...
    path('order/create/', views.create_order, name='order_create'),
    path('order/<int:order_id>/', views.order_detail, name='order_detail'),
    path('search/', views.search, name='search'),
    path('csrf-token/', views.get_csrf_token, name='csrf_token'),
    path('demo/bulk-operations/', views.bulk_operations_demo, name='bulk_operations_demo'),
    path('demo/f-expressions/', views.f_expressions_demo, name='f_expressions_demo'),
    path('demo/upload/', views.upload_product_images, name='upload_product_images'),
    path('product-404/<int:pk>/', views.product_detail_with_404, name='product_detail_404'),
] 