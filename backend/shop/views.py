from django.shortcuts import render
from .models import Product
from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from shop.models import Product
from .models import asexam
from django.db.models import Avg
from .cart import Cart
from django.contrib import messages
from .forms import ContactForm, FeedbackForm, ReviewForm
from django.core.mail import send_mail
from django.conf import settings
from .forms import OrderCreateForm
from .models import Order, OrderItem
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
import json
from django.contrib.auth import authenticate
from .models import AuthToken

def asexam_view(request):
    exams = asexam.objects.filter(is_public=True)
    return render(request, 'asexam.html', {
        'exams': exams,
        'full_name': 'Александр Шульга',
        'group': '231-361'
    })

def avg_price(request):
    result = Product.objects.aggregate(Avg('price'))
    average_price = result['price__avg']
    return render(request, 'shop/avg_price.html', {'average': average_price})


def home(request):
    # Последние товары (3 последних по дате создания или ID)
    latest_products = Product.objects.order_by('-id')[:3]

    # Все товары с изображением, по убыванию цены
    product_list = Product.objects.available()\
        .exclude(image__isnull=True)\
        .order_by('-price')

    paginator = Paginator(product_list, 8)  # 8 товаров на страницу (2 ряда по 4)
    page_number = request.GET.get('page')

    try:
        products = paginator.page(page_number)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    page_obj = products

    return render(request, 'shop/index.html', {
        'products': products,
        'latest_products': latest_products,
        'page_obj': page_obj,
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

def about(request):
    return render(request, 'shop/about.html')

PRODUCT_TYPE_TITLES = {
    'honey': 'Мёд',
    'comb': 'Соты',
    'propolis': 'Прополис',
    'bee_pollen': 'Пыльца',
    'wax': 'Воск'
}


def products_by_type(request, type):
    products = Product.objects.filter(product_type=type)
    title = PRODUCT_TYPE_TITLES.get(type, 'Категория')
    return render(request, 'shop/products_by_type.html', {
        'products': products,
        'type': type,
        'title': title
    })

def add_to_cart(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.add(product)
    return redirect(request.GET.get('next', 'index'))

def remove_from_cart(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product)
    return redirect('cart_detail')

def cart_detail(request):
    cart = Cart(request)
    return render(request, 'shop/cart.html', {'cart': cart})

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact = form.save()  # Сохраняем в базу данных
            
            # Отправка email администратору
            email_message = f"""
            Новое сообщение от {contact.name}
            Email: {contact.email}
            Тема: {contact.subject}
            
            {contact.message}
            """
            try:
                send_mail(
                    f"Новое сообщение: {contact.subject}",
                    email_message,
                    contact.email,
                    [settings.DEFAULT_FROM_EMAIL],
                    fail_silently=False,
                )
                messages.success(request, 'Спасибо! Ваше сообщение успешно отправлено.')
                return redirect('contact')
            except Exception as e:
                messages.error(request, 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.')
    else:
        form = ContactForm()
    
    return render(request, 'shop/contact.html', {'form': form})

def feedback_view(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            feedback = form.save()  # Сохраняем в базу данных
            
            # Отправка feedback администратору
            email_message = f"""
            Новая обратная связь
            От: {feedback.name}
            Email: {feedback.email}
            Тип: {feedback.get_feedback_type_display()}
            
            {feedback.message}
            """
            try:
                send_mail(
                    f"Обратная связь: {feedback.get_feedback_type_display()}",
                    email_message,
                    feedback.email,
                    [settings.DEFAULT_FROM_EMAIL],
                    fail_silently=False,
                )
                messages.success(request, 'Спасибо за ваш отзыв! Мы обязательно рассмотрим его.')
                return redirect('feedback')
            except Exception as e:
                messages.error(request, 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.')
    else:
        form = FeedbackForm()
    
    return render(request, 'shop/feedback.html', {'form': form})

def add_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.product = product
            review.user = request.user
            review.save()
            messages.success(request, 'Спасибо за ваш отзыв!')
            return redirect('product_detail', pk=product_id)
    else:
        form = ReviewForm()
    
    return render(request, 'shop/add_review.html', {
        'form': form,
        'product': product
    })

def create_order(request):
    cart = Cart(request)
    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.save()
            
            # Создаем OrderItem для каждого товара в корзине
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price_at_purchase=item['price']
                )
            
            # Очищаем корзину
            cart.clear()
            
            return redirect('order_detail', order_id=order.id)
    else:
        form = OrderCreateForm()
    return render(request, 'shop/order/create.html', {
        'cart': cart,
        'form': form
    })

def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    # Используем связь ManyToManyField для получения товаров
    order_items = order.orderitem_set.all().select_related('product')
    return render(request, 'shop/order/detail.html', {
        'order': order,
        'items': order_items
    })

def search(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        results = Product.objects.filter(name__icontains=query)
    return render(request, 'shop/search_results.html', {'query': query, 'results': results})

@ensure_csrf_cookie
@require_http_methods(["GET"])
def get_csrf_token(request):
    """API endpoint для получения CSRF токена"""
    return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """API endpoint для регистрации пользователей"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Валидация
        if not username or not email or not password:
            return JsonResponse({
                'success': False, 
                'error': 'Все поля обязательны для заполнения'
            }, status=400)
        
        if len(password) < 6:
            return JsonResponse({
                'success': False, 
                'error': 'Пароль должен содержать минимум 6 символов'
            }, status=400)
        
        # Проверка на существование пользователя
        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'success': False, 
                'error': 'Пользователь с таким именем уже существует'
            }, status=400)
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'success': False, 
                'error': 'Пользователь с таким email уже существует'
            }, status=400)
        
        # Создание пользователя
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Создаем токен для автоматического входа
        token = AuthToken.objects.create(user=user)
        
        return JsonResponse({
            'success': True,
            'message': 'Регистрация прошла успешно!',
            'token': token.token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'error': 'Неверный формат данных'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': 'Произошла ошибка при регистрации'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    """API endpoint для авторизации пользователей с токенами"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        # Валидация
        if not username or not password:
            return JsonResponse({
                'success': False, 
                'error': 'Имя пользователя и пароль обязательны'
            }, status=400)
        
        # Аутентификация
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_active:
                # Удаляем старые токены пользователя
                AuthToken.objects.filter(user=user).delete()
                
                # Создаем новый токен
                token = AuthToken.objects.create(user=user)
                
                return JsonResponse({
                    'success': True,
                    'message': 'Вход выполнен успешно!',
                    'token': token.token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                })
            else:
                return JsonResponse({
                    'success': False, 
                    'error': 'Аккаунт деактивирован'
                }, status=400)
        else:
            return JsonResponse({
                'success': False, 
                'error': 'Неверное имя пользователя или пароль'
            }, status=400)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'error': 'Неверный формат данных'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': 'Произошла ошибка при входе'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def current_user(request):
    """API endpoint для получения данных текущего пользователя по токену"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({
            'success': False,
            'error': 'Токен авторизации не предоставлен'
        }, status=401)
    
    token_value = auth_header.split(' ')[1]
    
    try:
        token = AuthToken.objects.get(token=token_value)
        if token.is_valid():
            return JsonResponse({
                'success': True,
                'user': {
                    'id': token.user.id,
                    'username': token.user.username,
                    'email': token.user.email,
                    'is_authenticated': True
                }
            })
        else:
            # Токен истек, удаляем его
            token.delete()
            return JsonResponse({
                'success': False,
                'error': 'Токен истек'
            }, status=401)
    except AuthToken.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Недействительный токен'
        }, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def logout_user(request):
    """API endpoint для выхода из системы (удаление токена)"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({
            'success': False,
            'error': 'Токен авторизации не предоставлен'
        }, status=401)
    
    token_value = auth_header.split(' ')[1]
    
    try:
        token = AuthToken.objects.get(token=token_value)
        token.delete()
        return JsonResponse({
            'success': True,
            'message': 'Выход выполнен успешно'
        })
    except AuthToken.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Недействительный токен'
        }, status=401)