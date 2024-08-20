from django import template

register = template.Library()


@register.filter
def product_price(item):
    if item.product.discounted_price > 0:
        return item.quantity * item.product.discounted_price
    return item.quantity * item.product.price


@register.filter
def calculate_total_price(items):
    total_price = 0
    if items:
        for item in items:
            if item.product.discounted_price > 0:
                total_price += item.quantity * item.product.discounted_price
            else:
                total_price += item.quantity * item.product.price
    return format(total_price, ".2f")

