from rest_framework import serializers
from .models import Donation_order

class Donation_order_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Donation_order
        fields = ("donation_total", "account", "time", "status", "stripe_transaction_id")
