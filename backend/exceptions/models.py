from django.db import models

# Create your models here.
class ExceptionType(models.Model):
    description = models.CharField(max_length=20)

# Consultas de excepciones personalizadas
class CustomQueries(models.Model):
    name = models.CharField(max_length=60)
    query = models.TextField()
    # Obtener los guardados en la tabla seleccionada
    table = models.CharField(max_length=120)
    only_this_connection = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Opcional, guardar solo para esta conexión
    connection = models.ForeignKey('auditoria_bd_api.DatabaseConnection', on_delete=models.CASCADE) 
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)