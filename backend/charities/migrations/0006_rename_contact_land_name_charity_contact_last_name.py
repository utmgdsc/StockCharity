# Generated by Django 5.1.5 on 2025-03-27 18:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charities', '0005_rename_email_charity_charity_email_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='charity',
            old_name='contact_land_name',
            new_name='contact_last_name',
        ),
    ]
