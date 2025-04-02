from django.db import models


class Charity(models.Model):

    charity_name = models.CharField(max_length=150, blank=True)

    charity_phone_number = models.CharField(max_length=15, blank=True, null=True)

    charity_email = models.EmailField(
        unique=True,
        max_length=255,
        blank=False
    )

    contact_email = models.EmailField(
        unique=True,
        max_length=255,
        blank=False
    )

    contact_first_name = models.CharField(max_length=150, blank=True)

    contact_last_name = models.CharField(max_length=150, blank=True)

    contact_phone_number = models.CharField(max_length=15, blank=True, null=True)

    is_approved = models.BooleanField(default=False)
    
    donations_received = models.FloatField(default=0)

    logo_path = models.CharField(blank=True, max_length=50, help_text='The path of the logo stored relative to root.')
