from django.contrib import admin
from .models import Stock

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('stock_name', 'symbol', 'quantity')
    search_fields = ('stock_name', 'symbol')