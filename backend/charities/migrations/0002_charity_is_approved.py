# Generated by Django 5.1.5 on 2025-03-08 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('charities', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='charity',
            name='is_approved',
            field=models.BooleanField(default=True),
        ),
    ]
