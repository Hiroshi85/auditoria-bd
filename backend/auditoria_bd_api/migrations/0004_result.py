# Generated by Django 5.0.3 on 2024-04-02 05:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auditoria_bd_api', '0003_databaseconnection_current_used'),
        ('exceptions', '0001_exception_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table', models.CharField(max_length=256)),
                ('results', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('connection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auditoria_bd_api.databaseconnection')),
                ('exception_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exceptions.exceptiontype')),
            ],
        ),
    ]
