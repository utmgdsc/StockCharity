# Generated by Django 5.1.5 on 2025-03-03 21:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_merge_20250225_0943'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='total_donations',
            field=models.FloatField(default=0),
        ),
    ]
