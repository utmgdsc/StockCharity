from rest_framework import serializers
from .models import DividendReceived


class DividendReceivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = DividendReceived
        fields = ["id", "date", "value"]
