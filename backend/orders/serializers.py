from rest_framework import serializers
from .models import DonationOrder


class DonationOrderSerializer(serializers.HyperlinkedModelSerializer):
    stripe_transaction_id = serializers.CharField(write_only=True)

    class Meta:
        model = DonationOrder
        fields = ("amount", "date", "status", "stripe_transaction_id")
