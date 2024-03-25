from django.urls import path
from .views import *

urlpatterns = [
    path('db/<int:id>/sequence', view=sequence_exception),
  
]
