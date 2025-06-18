#!/bin/bash

# Настройки портов
FRONTEND_PORT=3000
BACKEND_PORT=8000

# Функция убийства процесса по порту
kill_port() {
  PORT=$1
  PID=$(lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    echo " Порт $PORT занят. Убиваю процесс $PID..."
    kill -9 $PID
  else
    echo " Порт $PORT свободен"
  fi
}

# Убить процессы, если они уже висят
kill_port $FRONTEND_PORT
kill_port $BACKEND_PORT

# Запустить фронтенд
echo "Запускаю фронтенд на порту $FRONTEND_PORT..."
(cd frontend && npm start) &

# Запустить бэкенд
echo "Запускаю бэкенд на порту $BACKEND_PORT..."
(cd backend && python3 manage.py runserver)