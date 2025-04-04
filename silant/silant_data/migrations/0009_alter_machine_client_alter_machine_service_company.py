# Generated by Django 5.1.6 on 2025-03-12 09:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant_data', '0008_alter_machine_client_alter_machine_service_company'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='client',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='machine', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='machine',
            name='service_company',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='machine', to='silant_data.service_company'),
        ),
    ]
