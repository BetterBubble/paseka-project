from django.shortcuts import render
from .models import Product
from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from shop.models import Product
from .models import asexam

def asexam_view(request):
    exams = asexam.objects.filter(is_public=True)
    return render(request, 'asexam.html', {
        'exams': exams,
        'full_name': 'Александр Шульга',
        'group': '231-361'
    })


def home(request):
    # Последние товары (3 последних по дате создания или ID)
    latest_products = Product.objects.order_by('-id')[:3]

    # Все товары с изображением, по убыванию цены
    product_list = Product.objects.available()\
        .exclude(image__isnull=True)\
        .order_by('-price')

    paginator = Paginator(product_list, 4)  # 4 товара на страницу
    page_number = request.GET.get('page')

    try:
        products = paginator.page(page_number)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    return render(request, 'shop/index.html', {
        'products': products,
        'latest_products': latest_products
    })

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'shop/product_detail.html', {'product': product})

def honey_products(request):
    # 1. filter: только мед
    honey = Product.objects.filter(product_type='honey')
    return render(request, 'shop/honey_list.html', {'products': honey})

def products_with_image(request):
    # 2. exclude: исключаем товары без изображения
    with_image = Product.objects.exclude(image='')
    return render(request, 'shop/products_with_image.html', {'products': with_image})

def expensive_products(request):
    # 3. order_by: сортировка по цене (убывание)
    expensive = Product.objects.order_by('-price')
    return render(request, 'shop/expensive_products.html', {'products': expensive})

def altai_products(request):
    products = Product.objects.filter(region__name__icontains='алтай')
    return render(request, 'shop/honey_list.html', {'products': products})

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # перенаправляем на логин после успешной регистрации
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})
