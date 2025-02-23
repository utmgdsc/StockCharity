from rest_framework import serializers
from .models import DonationOrder

class DonationOrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DonationOrder
        fields = ("donation_total", "account", "time", "status", "stripe_transaction_id")
