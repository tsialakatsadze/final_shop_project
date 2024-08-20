import uuid
from django.core.exceptions import ValidationError
from django.db import models
from django.urls import reverse
from django_resized import ResizedImageField
from datetime import datetime
from functools import partial
from django.contrib.auth.models import AbstractUser, User


def wrapper(instance, filename, target):
    _now = datetime.now()
    extension = filename.split(".")[-1].lower()
    new_filename = uuid.uuid4().hex

    if extension not in ["jpg", "png", "jpeg", 'webp']:
        raise ValidationError(f"სურათის გაფართოება არასწორია: {filename}")

    return 'static/storage/{target}/{year}/{month}/{day}/{new_filename}.webp'.format(
        target=target,
        new_filename=new_filename,
        year=_now.strftime('%Y'),
        month=_now.strftime('%m'),
        day=_now.strftime('%d')
    )


def get_absolute_url():
    return reverse("cart:cart_detail")


# Create your models here.
class Category(models.Model):
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name="სათაური")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="სათაური")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="შექმნის თარიღი")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="განახლების თარიღი")

    def __str__(self):
        return f"{self.title}"

    def get_absolute_slug(self):
        return '/category/' + '' + self.slug

    class Meta:
        verbose_name = 'კატეგორია'
        verbose_name_plural = 'კატეგორიები'


class Product(models.Model):
    categories = models.ManyToManyField(Category, verbose_name='კატეგორიები')
    title = models.CharField(max_length=255, verbose_name='სათაური')
    description = models.TextField(verbose_name='აღწერა')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='ლინკი')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='ფასი')
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='ფასდაკლებული ფასი')
    image = ResizedImageField(force_format="WEBP", quality=90, size=[960, None], upload_to=partial(wrapper, target="products"), verbose_name='სურათი')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='შექმნის თარიღი')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='განახლების თარიღი')

    def __str__(self):
        return f"{self.title}"

    def get_absolute_slug(self):
        return '/product/' + '' + self.slug

    class Meta:
        verbose_name = 'პროდუქტი'
        verbose_name_plural = 'პროდუქტები'


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.RESTRICT, verbose_name='მომხმარებელი')
    product = models.ForeignKey(Product, on_delete=models.RESTRICT, verbose_name='პროდუქტი')
    quantity = models.IntegerField(default=1, verbose_name='რაოდენობა')

    def __str__(self):
        return f"{self.quantity} x {self.product}"

    class Meta:
        verbose_name = 'კალათა'
        verbose_name_plural = 'კალათა'


class OrderStatus(models.Model):
    title = models.CharField(max_length=150, verbose_name='სათაური')

    def __str__(self):
        return f"{self.title}"

    class Meta:
        verbose_name = 'შეკვეთის სტატუსი'
        verbose_name_plural = 'შეკვეთის სტატუსები'


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.RESTRICT, verbose_name='მომხმარებელი')
    firstname = models.CharField(max_length=150, verbose_name='სახელი')
    lastname = models.CharField(max_length=150, verbose_name='გვარი')
    phone = models.CharField(max_length=150, verbose_name='ტელეფონი')
    city = models.CharField(max_length=150, verbose_name='ქალაქი')
    region = models.CharField(max_length=150, default=None, blank=True, null=True, verbose_name='რეგიონი')
    address = models.CharField(max_length=150, verbose_name='მისამართი')
    second_address = models.CharField(max_length=150, default=None, blank=True, null=True, verbose_name='მისამართი 2')
    additional_info = models.TextField(default=None, blank=True, null=True, verbose_name='დამატებითი ინფორმაცია')
    delivery_schedule = models.CharField(max_length=16, verbose_name='მიწოდების განრიგი')
    order_status = models.ForeignKey(OrderStatus, on_delete=models.RESTRICT, default=1, related_name='%(class)s_order_status', verbose_name='შეკვეთის სტატუსი')
    payment_status = models.ForeignKey(OrderStatus, on_delete=models.RESTRICT, default=1, related_name='%(class)s_payment_status', verbose_name='გადახდის სტატუსი')
    total_price = models.DecimalField(max_digits=14, decimal_places=6, verbose_name='სრული ღირებულება')
    payed_at = models.DateTimeField(null=True, default=None, blank=True, verbose_name='გადახდის თარიღი')
    delivered_at = models.DateTimeField(null=True, default=None, blank=True, verbose_name='მიწოდების თარიღი')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='შექმნის თარიღი')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='განახლების თარიღი')

    def __str__(self):
        return f"შეკვეთა #{self.id} - {self.firstname} {self.lastname}"

    class Meta:
        verbose_name = 'შეკვეთა'
        verbose_name_plural = 'შეკვეთები'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.RESTRICT, verbose_name='შეკვეთა')
    product = models.ForeignKey(Product, on_delete=models.RESTRICT, verbose_name='პროდუქტი')
    quantity = models.IntegerField(default=1, verbose_name='რაოდენობა')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='თანხა')

    def __str__(self):
        return 'პროდუქტი #' + str(self.id) + ' შეკვეთა #' + str(self.order.id)

    class Meta:
        verbose_name = 'შეკვეთის ნივთი'
        verbose_name_plural = 'შეკვეთის ნივთები'