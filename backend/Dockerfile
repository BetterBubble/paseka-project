FROM python:3.12-slim

WORKDIR /app/backend

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements.txt и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код проекта
COPY . .

# Открываем порт
EXPOSE 8000

# Команда для запуска
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 