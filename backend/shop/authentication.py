# Standard Library
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

# Local
from .models import AuthToken

User = get_user_model()

class BearerTokenAuthentication(BaseAuthentication):
    """
    Кастомная аутентификация на основе Bearer-токенов.
    Проверяет наличие и валидность токена в заголовке Authorization.
    """
    def authenticate(self, request):
        """
        Аутентифицирует запрос на основе Bearer-токена.
        Args:
            request: HTTP запрос
        Returns:
            tuple: (user, token) если аутентификация успешна
            None: если токен отсутствует
        Raises:
            AuthenticationFailed: если токен недействителен или истёк
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        try:
            token = auth_header.split(' ')[1]
            auth_token = AuthToken.objects.get(token=token)

            if not auth_token.is_valid():
                raise AuthenticationFailed('Токен истёк')

            return (auth_token.user, auth_token)
        except AuthToken.DoesNotExist as exc:
            raise AuthenticationFailed('Неверный токен') from exc
        except IndexError as exc:
            raise AuthenticationFailed('Неверный формат токена') from exc

    def authenticate_header(self, request):
        """
        Возвращает тип аутентификации для заголовка WWW-Authenticate.
        Args:
            request: HTTP запрос
        Returns:
            str: тип аутентификации
        """
        return 'Bearer'
