from django.urls import path
from .views import main, campos_exception_view

urlpatterns = [
    path('campos/conexion/<int:id>', view=campos_exception_view.obtain_valores),
    path('sequence/', view=main.sequence_exception),
  
]
