from django.shortcuts import render
from .models import Product, Category, Manufacturer
from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from shop.models import Product
from django.db.models import Avg, F, Q
from .cart import Cart
from django.contrib import messages
from .forms import ContactForm, FeedbackForm, ReviewForm, OrderCreateForm, ProductImageUploadForm
from django.core.mail import send_mail
from django.conf import settings
from .models import Order, OrderItem
from django.http import JsonResponse, Http404
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST
from django.contrib.auth.models import User
import json
from django.contrib.auth import authenticate
from .models import AuthToken
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from .serializers import ProductSerializer, CategorySerializer, ManufacturerSerializer
from django.utils import translation
from django.db import transaction

def home(request):
    """Главная страница"""
    # Оптимизированный запрос с select_related для уменьшения количества запросов к БД
    latest_products = Product.objects.select_related('category', 'manufacturer').filter(available=True).order_by('-created_at')[:8]
    
    # Демонстрация работы с кешем
    popular_categories = cache.get('popular_categories')
    if not popular_categories:
        popular_categories = Category.objects.filter(products__available=True).distinct()[:4]
        cache.set('popular_categories', popular_categories, 300)  # 5 минут
    
    context = {
        'latest_products': latest_products,
        'popular_categories': popular_categories,
    }
    return render(request, 'shop/index.html', context)

def avg_price(request):
    result = Product.objects.aggregate(Avg('price'))
    average_price = result['price__avg']
    return render(request, 'shop/avg_price.html', {'average': average_price})

def product_detail(request, pk):
    product = get_object_or_404(
        Product.objects.select_related('category', 'manufacturer', 'region')
        .prefetch_related('reviews', 'reviews__user'),
        pk=pk
    )
    return render(request, 'shop/product_detail.html', {'product': product})

def honey_products(request):
    # 1. filter: только мед + chaining filters
    honey = Product.objects.select_related('category', 'manufacturer', 'region').filter(product_type='honey').filter(available=True).exclude(stock_quantity=0)
    return render(request, 'shop/honey_list.html', {'products': honey})

def products_with_image(request):
    # 2. exclude: исключаем товары без изображения + limiting QuerySets
    products = Product.objects.select_related('category', 'manufacturer', 'region').exclude(image__isnull=True).exclude(image__exact='')[:10]  # Ограничиваем до 10
    return render(request, 'shop/products_with_image.html', {'products': products})

def expensive_products(request):
    # 3. order_by: сортировка по цене (убывание) + values() и values_list()
    expensive = Product.objects.select_related('category', 'manufacturer', 'region').filter(price__gte=5000).order_by('-price')[:5]
    
    # Демонстрация values() и values_list()
    product_names = Product.objects.values_list('name', flat=True)[:10]  # Только названия
    product_data = Product.objects.values('name', 'price', 'category__name')[:10]  # Словари с данными
    
    context = {
        'products': expensive,
        'product_names': product_names,
        'product_data': product_data
    }
    return render(request, 'shop/expensive_products.html', context)

def altai_products(request):
    products = Product.objects.select_related('category', 'manufacturer', 'region').filter(region__name__icontains='алтай')
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
    products = Product.objects.select_related('category', 'manufacturer', 'region').filter(product_type=type)
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
    order = get_object_or_404(
        Order.objects.select_related('user', 'delivery_method')
        .prefetch_related('products', 'orderitem_set'),
        id=order_id
    )
    return render(request, 'shop/order_detail.html', {'order': order})

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

# API Views для SPA
class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Базовый queryset всегда из модели Product
        queryset = Product.objects.available().select_related('category', 'manufacturer', 'region')
        
        # Фильтрация по категории
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Поиск по названию
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
            
        return queryset
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.available().select_related('category', 'manufacturer', 'region')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    
    @method_decorator(cache_page(60 * 10))  # Кешируем на 10 минут
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class ManufacturerListView(ListAPIView):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer
    permission_classes = [AllowAny]
    
    @method_decorator(cache_page(60 * 15))  # Кешируем на 15 минут
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# API Views для корзины
@csrf_exempt
@require_http_methods(["GET"])
def cart_view(request):
    """API для получения содержимого корзины"""
    cart = Cart(request)
    cart_data = {
        'items': [
            {
                'id': item['product'].id,
                'name': item['product'].name,
                'price': float(item['price']),
                'quantity': item['quantity'],
                'total_price': float(item['total_price']),
                'image': item['product'].image.url if item['product'].image else None
            }
            for item in cart
        ],
        'total_price': float(cart.get_total_price()),
        'total_items': len(cart)
    }
    return JsonResponse(cart_data)

@csrf_exempt
@require_http_methods(["POST"])
def add_to_cart_api(request):
    """API для добавления товара в корзину"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        product = get_object_or_404(Product, id=product_id)
        cart = Cart(request)
        cart.add(product, quantity=quantity)
        
        # Простой ответ для проверки
        return JsonResponse({
            'success': True,
            'message': f'Товар "{product.name}" добавлен в корзину',
            'product_id': product.id,
            'quantity': quantity
        })
    except json.JSONDecodeError as e:
        return JsonResponse({
            'success': False,
            'error': f'JSON decode error: {str(e)}'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error: {str(e)}'
        }, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def update_cart(request):
    """API для обновления количества товара в корзине"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        
        product = get_object_or_404(Product, id=product_id)
        cart = Cart(request)
        cart.add(product, quantity=quantity, update_quantity=True)
        
        # Возвращаем актуальные данные корзины
        cart_data = {
            'items': [
                {
                    'id': item['product'].id,
                    'name': item['product'].name,
                    'price': float(item['price']),
                    'quantity': item['quantity'],
                    'total_price': float(item['total_price']),
                    'image': item['product'].image.url if item['product'].image else None,
                    'product': {
                        'id': item['product'].id,
                        'name': item['product'].name,
                        'price': float(item['product'].price),
                        'image': item['product'].image.url if item['product'].image else None
                    }
                }
                for item in cart
            ],
            'total_price': float(cart.get_total_price()),
            'total_items': len(cart),
            'success': True,
            'message': 'Корзина обновлена'
        }
        return JsonResponse(cart_data)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def remove_from_cart_api(request):
    """API для удаления товара из корзины"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        
        product = get_object_or_404(Product, id=product_id)
        cart = Cart(request)
        cart.remove(product)
        
        # Возвращаем актуальные данные корзины
        cart_data = {
            'items': [
                {
                    'id': item['product'].id,
                    'name': item['product'].name,
                    'price': float(item['price']),
                    'quantity': item['quantity'],
                    'total_price': float(item['total_price']),
                    'image': item['product'].image.url if item['product'].image else None,
                    'product': {
                        'id': item['product'].id,
                        'name': item['product'].name,
                        'price': float(item['product'].price),
                        'image': item['product'].image.url if item['product'].image else None
                    }
                }
                for item in cart
            ],
            'total_price': float(cart.get_total_price()),
            'total_items': len(cart),
            'success': True,
            'message': f'Товар "{product.name}" удален из корзины'
        }
        return JsonResponse(cart_data)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def clear_cart(request):
    """API для очистки корзины"""
    cart = Cart(request)
    cart.clear()
    cart_data = {
        'items': [],
        'total_price': 0,
        'total_items': 0,
        'success': True,
        'message': 'Корзина очищена'
    }
    return JsonResponse(cart_data)

@require_POST
@csrf_exempt
def set_language_api(request):
    """API endpoint для переключения языка"""
    try:
        import json
        data = json.loads(request.body)
        language = data.get('language', 'ru')
        
        if language in ['ru', 'en']:
            translation.activate(language)
            request.session[translation.LANGUAGE_SESSION_KEY] = language
            return JsonResponse({
                'status': 'success', 
                'language': language,
                'message': f'Language changed to {language}'
            })
        return JsonResponse({
            'status': 'error', 
            'message': 'Invalid language'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

# Новые функции для демонстрации недостающих возможностей

def bulk_operations_demo(request):
    """Демонстрация bulk операций update() и delete()"""
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'apply_discount':
            # Массовое обновление - применяем скидку 10% к дорогим товарам
            Product.objects.filter(price__gte=5000, discount_price__isnull=True).update(
                discount_price=F('price') * 0.9
            )
            
        elif action == 'remove_out_of_stock':
            # Массовое удаление товаров без остатка (только для демонстрации)
            # В реальности лучше делать available=False
            count = Product.objects.filter(stock_quantity=0, available=False).count()
            Product.objects.filter(stock_quantity=0, available=False).delete()
            
        elif action == 'increase_stock':
            # F expressions - увеличиваем остаток на складе на 10
            Product.objects.filter(available=True).update(
                stock_quantity=F('stock_quantity') + 10
            )
            
    return render(request, 'shop/bulk_operations.html')

def f_expressions_demo(request):
    """Демонстрация F expressions"""
    # F expressions для вычислений на уровне БД
    products_with_calculated_fields = Product.objects.annotate(
        price_with_tax=F('price') * 1.2,  # Цена с НДС 20%
        discount_amount=F('price') - F('discount_price'),  # Размер скидки
        stock_value=F('price') * F('stock_quantity')  # Стоимость остатка
    ).filter(available=True)
    
    return render(request, 'shop/f_expressions.html', {'products': products_with_calculated_fields})

def product_detail_with_404(request, pk):
    """Демонстрация Http404 exception"""
    try:
        product = Product.objects.select_related('category', 'manufacturer', 'region').get(pk=pk, available=True)
    except Product.DoesNotExist:
        raise Http404("Товар не найден или недоступен")
    
    # Chaining filters для связанных товаров
    related_products = Product.objects.filter(
        category=product.category
    ).exclude(
        pk=product.pk
    ).filter(
        available=True
    )[:4]  # Limiting QuerySets
    
    context = {'product': product, 'related_products': related_products}
    return render(request, 'shop/product_detail.html', context)

def upload_product_images(request):
    """Демонстрация File Uploads и request.FILES"""
    if request.method == 'POST':
        form = ProductImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            # Основные файлы из формы
            main_image = form.cleaned_data.get('image')
            manual_file = form.cleaned_data.get('manual')
            description = form.cleaned_data.get('upload_description')
            
            # Обработка дополнительных изображений из request.FILES
            additional_images = request.FILES.getlist('additional_images')
            
            # Сохраняем товар
            product = form.save(commit=False)
            product.description = description or 'Товар загружен через форму'
            product.category_id = 1  # Временно присваиваем первую категорию
            product.manufacturer_id = 1  # Временно присваиваем первого производителя
            product.region_id = 1  # Временно присваиваем первый регион
            product.price = 1000  # Временная цена
            product.save()
            
            # Обработка дополнительных изображений
            upload_info = {
                'product_id': product.id,
                'main_image': main_image.name if main_image else None,
                'manual': manual_file.name if manual_file else None,
                'additional_count': len(additional_images),
                'additional_files': [img.name for img in additional_images]
            }
            
            # В реальном проекте здесь бы сохранялись дополнительные изображения
            # в отдельную модель или обрабатывались другим способом
            
            messages.success(request, f'Товар "{product.name}" успешно создан! Загружено файлов: {len(additional_images) + (1 if main_image else 0) + (1 if manual_file else 0)}')
            return redirect('product_detail', pk=product.id)
        else:
            messages.error(request, 'Ошибка при загрузке файлов. Проверьте форму.')
    else:
        form = ProductImageUploadForm()
    
    return render(request, 'shop/upload_form.html', {'form': form})