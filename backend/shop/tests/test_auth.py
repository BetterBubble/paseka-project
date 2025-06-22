from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from shop.models import AuthToken
from datetime import datetime, timedelta
from django.utils import timezone
import json

User = get_user_model()

class AuthenticationTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.api_client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_api_token_auth(self):
        # Тест получения токена
        response = self.api_client.post(
            reverse('api_login'),
            json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertTrue('token' in response_data)
        self.assertTrue('user' in response_data)
        self.assertEqual(response_data['user']['username'], 'testuser')

        # Тест использования токена
        token = response_data['token']
        self.api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.api_client.get(reverse('api_current_user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['user']['username'], 'testuser')

    def test_invalid_login(self):
        response = self.api_client.post(
            reverse('api_login'),
            json.dumps({
                'username': 'testuser',
                'password': 'wrongpass'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['error'], 'Неверное имя пользователя или пароль')

    def test_token_expiration(self):
        # Создаем токен с истекшим сроком действия
        expired_token = AuthToken.objects.create(
            user=self.user,
            token='test_token',
            expires_at=timezone.now() - timedelta(days=1)
        )

        # Пытаемся использовать истекший токен
        self.api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {expired_token.token}')
        response = self.api_client.get(reverse('api_current_user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['error'], 'Токен истек')

    def test_invalid_token_format(self):
        # Тест неверного формата токена
        self.api_client.credentials(HTTP_AUTHORIZATION='Bearer')
        response = self.api_client.get(reverse('api_current_user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['error'], 'Токен авторизации не предоставлен')

        # Тест отсутствующего токена
        self.api_client.credentials(HTTP_AUTHORIZATION='')
        response = self.api_client.get(reverse('api_current_user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['error'], 'Токен авторизации не предоставлен')

    def test_logout(self):
        # Сначала логинимся и получаем токен
        response = self.api_client.post(
            reverse('api_login'),
            json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        token = json.loads(response.content)['token']

        # Используем токен
        self.api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Выходим
        response = self.api_client.post(reverse('api_logout'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Выход выполнен успешно')

        # Проверяем, что токен больше не работает
        response = self.api_client.get(reverse('api_current_user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['error'], 'Недействительный токен')