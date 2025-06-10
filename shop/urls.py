from django.urls import path
from . import views

urlpatterns = [
    # ... existing patterns ...
    path('order/create/', views.create_order, name='order_create'),
    path('order/<int:order_id>/', views.order_detail, name='order_detail'),
] 