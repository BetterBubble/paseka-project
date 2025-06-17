from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from .models import AuthToken

class BearerTokenAuthentication(BaseAuthentication):
    """
    Кастомная аутентификация на основе Bearer-токенов
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        try:
            token = auth_header.split(' ')[1]
            auth_token = AuthToken.objects.get(token=token)
            
            if not auth_token.is_valid():
                raise AuthenticationFailed('Токен истёк')
            
            return (auth_token.user, auth_token)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed('Неверный токен')
        except IndexError:
            raise AuthenticationFailed('Неверный формат токена')
    
    def authenticate_header(self, request):
        return 'Bearer' 