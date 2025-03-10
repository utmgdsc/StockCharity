from rest_framework import serializers
from .models import PurchasedStock

class PurchasedStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchasedStock
        fields = '__all__'