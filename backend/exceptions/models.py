from django.db import models

# Create your models here.
class ExceptionType(models.Model):
    description = models.CharField(max_length=20)