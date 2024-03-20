from rest_framework.authtoken.models import Token
from django.http import HttpResponse

class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/auth'):
            # Skip the middleware for the /auth endpoint
            return self.get_response(request)

        token = request.COOKIES["api-token"]

        user = Token.objects.get(key=token).user

        if user:
            request.userdb = user
            return self.get_response(request)   
        
        return HttpResponse('No Autorizado', status=401)
