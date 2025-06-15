# Работа с изображениями в проекте

## Типы изображений

### 1. Изображения товаров (медиафайлы)
- **Расположение**: `media/products/`
- **Доступ через API**: Поле `image_url` в сериализаторе товаров
- **URL**: `http://localhost:8000/media/products/filename.png`

### 2. Статические изображения
- **Расположение**: `shop/static/shop/assets/`
- **URL**: `http://localhost:8000/static/shop/assets/filename.png`

## Доступные статические изображения

### Основные изображения сайта:
- `Header_apiary.png` - Фоновое изображение главной страницы
- `about_banner.png` - Баннер страницы "О нас"
- `about_main.png` - Основное изображение на странице "О нас"

### Команда:
- `team1.png` - Иван Пчелов (Главный пчеловод)
- `team2.png` - Мария Медова (Технолог-эксперт)
- `team3.png` - Петр Сотов (Менеджер по качеству)

### Другие:
- `favicon.ico` - Иконка сайта

## Использование в React компонентах

### Импорт утилит:
```javascript
import { getStaticImageUrl, STATIC_IMAGES } from '../utils/images';
```

### Статические изображения:
```javascript
<img src={getStaticImageUrl(STATIC_IMAGES.HEADER_APIARY)} alt="Пасека" />
```

### Изображения товаров:
```javascript
<img src={product.image_url} alt={product.name} />
```

## Настройка серверов

### Django (порт 8000):
- Медиафайлы: `/media/` → `MEDIA_ROOT`
- Статические файлы: `/static/` → `STATICFILES_DIRS`

### React Dev Server (порт 3000):
- Прокси для `/api/`, `/media/`, `/static/` → Django сервер

## Диагностика

### Проверка статуса изображений:
- Перейти на `http://localhost:3000/image-status`
- Тестовая страница: `http://localhost:3000/test-images`

### Проверка доступности через curl:
```bash
# Статические файлы
curl -I "http://localhost:8000/static/shop/assets/Header_apiary.png"

# Медиафайлы
curl -I "http://localhost:8000/media/products/filename.png"
```

## Решение проблем

1. **Изображения не загружаются**:
   - Проверить, что Django сервер запущен на порту 8000
   - Убедиться, что файлы существуют в соответствующих папках

2. **404 ошибки**:
   - Проверить настройки `STATIC_URL` и `MEDIA_URL` в Django
   - Убедиться, что `urlpatterns` включают `static()`

3. **CORS ошибки**:
   - Проверить настройки `CORS_ALLOW_ALL_ORIGINS` в settings.py
   - Убедиться, что `corsheaders` добавлен в `INSTALLED_APPS` 