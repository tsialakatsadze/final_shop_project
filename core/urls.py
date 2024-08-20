from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('category/<str:slug>/', views.category, name='category'),
    path("product/<str:product_slug>/details/", views.product_details, name="product_details"),
    path('accounts/login/', views.user_login, name='login'),
    path('accounts/register/', views.user_register, name='register'),
    path('accounts/logout/', views.user_logout, name='logout'),
    path("accounts/cart/add/<int:product_id>/", views.add_to_cart, name="add_to_cart"),
    path("accounts/cart/deduct/<int:cart_item_id>/", views.deduct_from_cart, name="deduct_from_cart"),
    path("accounts/cart/add/remove/<int:cart_item_id>/", views.remove_from_cart, name="remove_from_cart"),
    path("accounts/checkout/", views.checkout, name="checkout"),
    path("accounts/order/failed", views.order_failed, name="order_failed"),
    path("accounts/order/<int:order_id>", views.order, name="order"),
    path("accounts/orders", views.account_orders, name="account_orders"),
]
