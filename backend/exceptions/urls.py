from django.urls import path
from .views import *

urlpatterns = [
    path('sequence/', view=sequence_exception),
  
]
