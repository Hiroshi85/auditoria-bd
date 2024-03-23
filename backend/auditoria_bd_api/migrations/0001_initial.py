# Generated by Django 5.0.3 on 2024-03-20 15:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DatabaseConnection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('engine', models.CharField(max_length=512)),
                ('name', models.CharField(max_length=512)),
                ('host', models.TextField()),
                ('port', models.IntegerField()),
                ('username', models.CharField(max_length=512)),
                ('password', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]