# Generated by Django 5.0.3 on 2024-03-20 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auditoria_bd_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='databaseconnection',
            name='last_used',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
