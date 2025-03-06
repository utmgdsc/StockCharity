from django.db import models


class Charity(models.Model):

    email = models.EmailField(
        unique=True,
        max_length=255,
        blank=False
    )

    name = models.CharField(max_length=150, blank=True)

    phone_number = models.CharField(max_length=15, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    
    donations_received = models.FloatField(default=0)
