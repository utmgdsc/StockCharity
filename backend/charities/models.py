from django.db import models


class Charity(models.Model):

    email = models.EmailField(
        unique=True,
        max_length=255,
        blank=False
    )

    name = models.CharField(max_length=150, blank=True)

    phone_number = models.CharField(max_length=15, blank=True, null=True)

    is_approved = models.BooleanField(default=False)
    
    donations_received = models.FloatField(default=0)

    logo_path = models.CharField(blank=True, max_length=50, help_text='The path of the logo stored relative to root.')

    description = models.CharField(blank=True, max_length=300, help_text='A brief description about the charity that will be shown on our website.')
