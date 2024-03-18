from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()
    
    class Meta(object):
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'token']

    def get_token(self, obj):
        token = Token.objects.get(user=obj)
        return token.key
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)