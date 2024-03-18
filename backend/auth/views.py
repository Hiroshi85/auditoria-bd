from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.authtoken.models import Token

from .serializers import *

from django.contrib.auth.models import User

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        user = User.objects.get(username=request.data['username'])
        if not user.check_password(request.data['password']):
            raise exceptions.AuthenticationFailed('Password is incorrect')
    except User.DoesNotExist:
        raise exceptions.AuthenticationFailed('User not found')
        
    user = UserSerializer(user).data
    return Response(user)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)
  
    serializer.save()
    user = User.objects.get(username=serializer.data['username'])
    data = UserSerializer(user).data

    return Response(data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def validate_token(request):
    return Response({}, status=status.HTTP_200_OK)
