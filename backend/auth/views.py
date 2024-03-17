from auditoria_bd_api.utils import create_response, create_error_response

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from .serializers import *

from django.contrib.auth.models import User

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            create_error_response(code="400", message=serializer.errors),
            status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=request.data['username'])
    except User.DoesNotExist:
        return Response(create_error_response(message="Nombre de usuario no encontrado"))

    if not user.check_password(request.data['password']):
        return Response(create_error_response(message="Contraseña incorrecta"))

    token = Token.objects.get(user=user)
    user = UserSerializer(instance=user)
    data = user.data
    data.pop('password')
    return Response(create_response(data={"user": data, "token": token.key}))


@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(create_error_response(message=serializer.errors))

    serializer.save()
    user = User.objects.get(username=serializer.data['username'])
    user.set_password(request.data['password'])  # hash password
    user.save()
    token = Token.objects.create(user=user)
    return Response(create_response(data={"token": token.key}), status=status.HTTP_201_CREATED)


@api_view(['GET'])
def validate_token(request):
    return Response({"Token is valid"})
