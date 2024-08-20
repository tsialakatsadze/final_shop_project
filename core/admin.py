from django.contrib import admin

from core.models import Category, Product, Order, OrderItem, OrderStatus


# Register your models here.
class CategoryDisplay(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ["title", "slug", "created_at", "updated_at"]


class ProductDisplay(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ["title", "description", "created_at", "updated_at"]


class OrderStatusDisplay(admin.ModelAdmin):
    list_display = ['title']


class OrderItemDisplay(admin.TabularInline):
    list_display = ['item', 'quantity', 'ordered']
    model = OrderItem


class OrderDisplay(admin.ModelAdmin):
    list_display = (
        "firstname",
        "lastname",
        "phone",
        "order_status",
        "payment_status",
        "total_price",
        "payed_at",
        "delivered_at",
        "created_at",
        "updated_at"
    )
    inlines = [
        OrderItemDisplay,
    ]


admin.site.register(Category, CategoryDisplay)
admin.site.register(OrderStatus, OrderStatusDisplay)
admin.site.register(Product, ProductDisplay)
admin.site.register(Order, OrderDisplay)
