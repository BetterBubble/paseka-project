from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from .models import AuthToken

class TokenAuthentication(BaseAuthentication):
    """
    Кастомная аутентификация на основе наших токенов
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        try:
            token_value = auth_header.split(' ')[1]
            token = AuthToken.objects.get(token=token_value)
            
            if not token.is_valid():
                # Токен истек, удаляем его
                token.delete()
                raise AuthenticationFailed('Токен истек')
            
            return (token.user, token)
            
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed('Недействительный токен')
        except IndexError:
            raise AuthenticationFailed('Неверный формат токена')
    
    def authenticate_header(self, request):
        return 'Bearer' 