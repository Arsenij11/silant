# Generated by Django 5.1.6 on 2025-03-09 16:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant_data', '0002_remove_to_type_to_directory_to_type_to'),
    ]

    operations = [
        migrations.AlterField(
            model_name='directory_to',
            name='type_TO',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='directory_to', to='silant_data.directory_to'),
        ),
    ]
