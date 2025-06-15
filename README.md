# Интернет-магазин "Пчеловодство"

Проект интернет-магазина продуктов пчеловодства, разработанный с использованием Django и React.

## Описание проекта

Интернет-магазин специализируется на продаже продуктов пчеловодства:
- Мед различных сортов
- Прополис
- Пчелиный воск
- Пчелиная пыльца
- Соты

### Основные функции
- Каталог товаров с категориями
- Поиск по товарам
- Корзина покупок
- Система аутентификации
- Личный кабинет пользователя
- Административная панель

## Технологии

### Backend
- Python 3.x
- Django 4.x
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- React 18.x
- React Router
- Axios
- Webpack
- CSS3/SCSS

## Установка и запуск

### Предварительные требования
- Python 3.x
- Node.js 16.x или выше
- npm или yarn
- PostgreSQL

### Backend

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd paseka_project
```

2. Создайте и активируйте виртуальное окружение:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # для Linux/Mac
# или
venv\Scripts\activate  # для Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл .env в директории backend и настройте переменные окружения:
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

5. Примените миграции:
```bash
python manage.py migrate
```

6. Создайте суперпользователя:
```bash
python manage.py createsuperuser
```

7. Запустите сервер разработки:
```bash
python manage.py runserver
```

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm start
```

## Структура проекта

```
paseka_project/
├── backend/                 # Django backend
│   ├── med_site/           # Основной проект Django
│   ├── shop/               # Приложение магазина
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Модели данных
│   │   ├── serializers/   # Сериализаторы
│   │   ├── templates/     # HTML шаблоны
│   │   └── views/         # Представления
│   └── requirements.txt    # Зависимости Python
│
├── frontend/               # React frontend
│   ├── public/            # Статические файлы
│   ├── src/               # Исходный код
│   │   ├── components/    # React компоненты
│   │   ├── context/       # React контексты
│   │   ├── pages/         # Страницы приложения
│   │   ├── services/      # API сервисы
│   │   └── styles/        # CSS стили
│   └── package.json       # Зависимости Node.js
│
├── media/                 # Загруженные файлы
├── staticfiles/          # Собранные статические файлы
└── docs/                 # Документация проекта
```

## API Endpoints

### Аутентификация
- POST /api/login/ - Вход в систему
- POST /api/logout/ - Выход из системы
- GET /api/current-user/ - Информация о текущем пользователе

### Товары
- GET /api/products/ - Список товаров
- GET /api/products/{id}/ - Детали товара
- GET /api/categories/ - Список категорий

### Корзина
- GET /api/cart/ - Получить корзину
- POST /api/cart/add_item/ - Добавить товар
- POST /api/cart/update_quantity/ - Изменить количество
- POST /api/cart/remove_item/ - Удалить товар

## Разработка

### Стиль кода
- Python: PEP 8
- JavaScript: ESLint + Prettier
- React: Airbnb Style Guide

### Коммиты
Используйте conventional commits:
- feat: новая функциональность
- fix: исправление ошибок
- docs: изменения в документации
- style: форматирование кода
- refactor: рефакторинг кода
- test: добавление тестов
- chore: обновление зависимостей

## Лицензия

MIT 