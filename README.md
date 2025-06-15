# Paseka Project

Проект интернет-магазина медовой продукции.

## Структура проекта

```
paseka_project/
├── backend/                 # Django backend
│   ├── med_site/           # Django project
│   ├── shop/               # Django app
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/               # React source code
│   ├── public/            # Static files
│   ├── package.json
│   └── webpack.config.js
├── media/                 # User uploaded files
├── static/               # Static files
└── docs/                 # Documentation
    └── IMAGES_README.md
```

## Установка и запуск

### Backend (Django)

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте виртуальное окружение и активируйте его:
```bash
python3 -m venv venv
source venv/bin/activate  # для Linux/Mac
# или
venv\Scripts\activate  # для Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Примените миграции:
```bash
python3 manage.py migrate
```

5. Запустите сервер разработки:
```bash
python3 manage.py runserver
```

### Frontend (React)

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

## Разработка

- Backend API доступен по адресу: http://localhost:8000/api/
- Frontend доступен по адресу: http://localhost:3000/

## Документация

Дополнительная документация по изображениям и медиафайлам находится в директории `docs/`. 