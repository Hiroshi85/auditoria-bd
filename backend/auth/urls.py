from django.urls import path
from . import views

urlpatterns = [
    path('login', view=views.login),
    path('register', view=views.register),
    path('token', view=views.validate_token),    
]
