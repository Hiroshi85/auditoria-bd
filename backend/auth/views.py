from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from .serializers import *

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        
    token = Token.objects.get(user=user)
    user = UserSerializer(instance=user)
    data = user.data
    data.pop('password')
    return Response({"token": token.key, "user": data})

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
    serializer.save()
    user = User.objects.get(username=serializer.data['username'])
    user.set_password(request.data['password']) # hash password
    user.save()
    token = Token.objects.create(user=user)
    return Response({"token": token.key}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def validate_token(request):
    return Response({"Token is valid"})
