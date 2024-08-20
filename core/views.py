from urllib.parse import urlencode, parse_qs, urlsplit, urlunsplit

from django.db import transaction
from django.http import JsonResponse, HttpResponseRedirect, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from core.models import Category, Product, Order, OrderItem
from .forms import RegisterForm, LoginForm, CheckoutForm
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Cart


def set_query_parameter(url, param_name, param_value):
    """Given a URL, set or replace a query parameter and return the
    modified URL.

    >>> set_query_parameter('http://example.com?foo=bar&biz=baz', 'foo', 'stuff')
    'http://example.com?foo=stuff&biz=baz'

    """
    scheme, netloc, path, query_string, fragment = urlsplit(url)
    query_params = parse_qs(query_string)

    query_params[param_name] = [param_value]
    new_query_string = urlencode(query_params, doseq=True)

    return urlunsplit((scheme, netloc, path, new_query_string, fragment))


def calculate_total_price(items):
    total_price = 0
    if items:
        for item in items:
            if item.product.discounted_price > 0:
                total_price += item.quantity * item.product.discounted_price
            else:
                total_price += item.quantity * item.product.price
    return total_price


# Create your views here.
def home(request):
    if request.GET.get('q') is not None:
        search = request.GET.get('q')
        products = Product.objects.filter(title__icontains=search).order_by('-id')
    else:
        search = ""
        products = Product.objects.order_by('-id').all()

    categories = Category.objects.all()
    paginator = Paginator(products, 3)

    cart_items = None
    cart_items_total = 0

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).order_by('-id')
        cart_items_total = cart_items.count()

    return render(request, 'main.html', {
        'search': search,
        'category': None,
        'categories': categories,
        'paginator': paginator,
        'products': paginator.get_page(request.GET.get("page")),
        'cart_items': cart_items,
        'cart_items_total': cart_items_total
    })


def category(request, slug):
    category_object = Category.objects.get(slug=slug)

    if request.GET.get('q') is not None:
        search = request.GET.get('q')
        products = Product.objects.filter(title__icontains=search).filter(categories=category_object.id).order_by('-id')
    else:
        search = ""
        products = Product.objects.filter(categories=category_object).order_by('-id')

    categories = Category.objects.all()
    paginator = Paginator(products, 3)

    cart_items = None
    cart_items_total = 0

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).order_by('-id')
        cart_items_total = cart_items.count()

    context = {
        'search': search,
        'categories': categories,
        'active_category': category_object,
        'paginator': paginator,
        'products': paginator.get_page(request.GET.get("page")),
        'cart_items': cart_items,
        'cart_items_total': cart_items_total
    }

    return render(request, 'main.html', context)


def product_details(request, product_slug):
    product = get_object_or_404(Product, slug=product_slug)
    product_categories = product.categories.all()
    relative_products = Product.objects.filter(categories__in=product_categories).filter(id__lt=product.id).order_by(
        '-id').all()

    cart_items = None
    cart_items_total = 0

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).order_by('-id')
        cart_items_total = cart_items.count()

    context = {
        'product': product,
        'product_categories': product_categories,
        'relative_products': relative_products,
        'previous_url': request.META.get('HTTP_REFERER'),
        'cart_items': cart_items,
        'cart_items_total': cart_items_total
    }

    return render(request, 'product_details.html', context)


def user_register(request):
    if request.user.is_authenticated:
        return redirect(request.GET.get('next', 'home'))

    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if not request.POST.get('username').isascii() or " " in request.POST.get('username'):
            form.add_error('username', 'მომხმარებელი უნდა შედგებოდეს მხოლოდ ლათინური ასოებისაგან!')

            return JsonResponse({
                'success': 'false',
                'errors': form.errors
            }, status=422, safe=False)

        if form.is_valid():
            form.save()
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])

            if user:
                login(request, user)
                return JsonResponse({
                    'success': 'true',
                    'message': 'თქვენ წარმატებით დარეგისტრირდით!',
                    'redirect_route': request.GET.get('next') or '/'
                })

        return JsonResponse({
            'success': 'false',
            'errors': form.errors
        }, status=422, safe=False)
    else:
        form = RegisterForm()

    return render(request, 'register.html', {
        form: form
    })


def user_login(request):
    if request.user.is_authenticated:
        return redirect(request.GET.get('next', 'home'))

    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse({
                    'success': 'true',
                    'message': 'თქვენ წარმატებით გაიარეთ ავტორიზაცია!',
                    'redirect_route': request.GET.get('next') or '/'
                })
            else:
                form.add_error('username', 'მომხმარებელი ან პაროლი არასწორია')

        return JsonResponse({
            'success': 'false',
            'errors': form.errors
        }, status=422, safe=False)

    else:
        form = LoginForm()

    return render(request, 'login.html', {
        form: form
    })


@login_required(login_url='/accounts/login')
def user_logout(request):
    logout(request)
    return redirect('home')


@login_required(login_url='/accounts/login')
def add_to_cart(request, product_id):
    cart_item = Cart.objects.filter(user=request.user, product_id=product_id).first()

    if cart_item:
        cart_item.quantity += 1
        cart_item.save()
        messages.success(request, "ნივთი დამატებულია კალათაში..")
    else:
        Cart.objects.create(user=request.user, product_id=product_id)
        messages.success(request, "ნივთი დამატებულია კალათაში.")

    if request.GET.get('open_cart', 'false') == 'true':
        return HttpResponseRedirect(set_query_parameter(request.META.get('HTTP_REFERER'), "open_cart", 'true'))

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/accounts/login')
def deduct_from_cart(request, cart_item_id):
    cart_item = get_object_or_404(Cart, id=cart_item_id)

    if cart_item.user == request.user and cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
        messages.success(request, "ნივთის რაოდენობა დაკლებულია.")
    else:
        cart_item.delete()
        messages.success(request, "ნივთი წაშლილია თქვენი კალათიდან.")

    if request.GET.get('open_cart', 'false') == 'true':
        return HttpResponseRedirect(set_query_parameter(request.META.get('HTTP_REFERER'), "open_cart", 'true'))

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/accounts/login')
def remove_from_cart(request, cart_item_id, open_cart='false'):
    cart_item = get_object_or_404(Cart, id=cart_item_id)

    if cart_item.user == request.user:
        cart_item.delete()
        messages.success(request, "ნივთი წაშლილია თქვენი კალათიდან.")

    if request.GET.get('open_cart', 'false') == 'true':
        return HttpResponseRedirect(set_query_parameter(request.META.get('HTTP_REFERER'), "open_cart", 'true'))

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/accounts/login')
@transaction.atomic
def checkout(request):
    if request.method == "POST":
        form = CheckoutForm(request.POST)
        if form.is_valid():
            cart_items = Cart.objects.filter(user=request.user)
            total_price = calculate_total_price(items=cart_items)
            created_order = Order.objects.create(
                firstname=request.POST.get('firstname'),
                lastname=request.POST.get('lastname'),
                phone=request.POST.get('phone'),
                city=request.POST.get('city'),
                region=request.POST.get('region'),
                address=request.POST.get('address'),
                second_address=request.POST.get('second_address', None),
                additional_info=request.POST.get('additional_info', None),
                delivery_schedule=request.POST.get('delivery_schedule'),
                total_price=total_price,
                payed_at=None,
                delivered_at=None,
                user=request.user,
                order_status_id=1,
                payment_status_id=9
            )
            order_items = list()
            for item in cart_items:
                product_price = 0

                if item.product.discounted_price > 0:
                    product_price = item.product.discounted_price
                else:
                    product_price = item.product.price

                total_product_price = product_price * item.quantity

                order_items.append(OrderItem(
                    order=created_order,
                    product=item.product,
                    quantity=item.quantity,
                    price=total_product_price
                ))
            OrderItem.objects.bulk_create(order_items)
            cart_items.delete()
            return redirect('order', order_id=created_order.id)
    else:
        form = CheckoutForm()

    cart_items = Cart.objects.filter(user=request.user)
    total_price = calculate_total_price(items=cart_items)
    cart_items_total = cart_items.count()

    if cart_items.count() == 0:
        return redirect('home')

    context = {
        "cart_items": cart_items,
        "cart_items_total": cart_items_total,
        "total_price": format(total_price, ".2f"),
        "form": form,
    }

    return render(request, "checkout.html", context)


@login_required(login_url='/accounts/login')
def order(request, order_id):
    user_order = get_object_or_404(Order, id=order_id)
    order_items = OrderItem.objects.filter(order_id=user_order.id).all()
    cart_items = None
    cart_items_total = 0

    if user_order.user.id != request.user.id:
        return HttpResponseNotFound(f"შეკვეთა ნომრით #{user_order.id} თქვენ არ გეკუთვნით")

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).order_by('-id')
        cart_items_total = cart_items.count()

    context = {
        "order": user_order,
        "order_items": order_items,
        "cart_items": cart_items,
        'cart_items_total': cart_items_total
    }

    return render(request, 'order.html', context)


@login_required(login_url='/accounts/login')
def order_failed(request):
    cart_items = None
    cart_items_total = 0

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).order_by('-id')
        cart_items_total = cart_items.count()

    context = {
        "cart_items": cart_items,
        'cart_items_total': cart_items_total
    }

    return render(request, 'order_failed.html', context)


@login_required(login_url='/accounts/login')
def account_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-id')
    cart_items = None
    cart_items_total = 0

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).order_by('-id')
        cart_items_total = cart_items.count()

    context = {
        "orders": orders,
        "cart_items": cart_items,
        'cart_items_total': cart_items_total
    }

    return render(request, 'account_orders.html', context)
