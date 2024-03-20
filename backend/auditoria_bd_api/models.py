from django.db import models

# Create your models here.
class DatabaseConnection(models.Model):
    engine = models.CharField(max_length=512)
    name = models.CharField(max_length=512)
    host = models.TextField()
    port = models.IntegerField()
    username = models.CharField(max_length=512)
    password = models.TextField()

    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    last_used = models.DateTimeField(auto_now=True)
