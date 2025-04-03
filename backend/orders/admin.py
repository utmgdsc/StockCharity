from django.contrib import admin
from .models import DonationOrder


@admin.register(DonationOrder)
class DonationOrderAdmin(admin.ModelAdmin):
    pass
