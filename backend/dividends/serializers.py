from rest_framework import serializers
from .models import DividendReceived

class DividendReceivedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DividendReceived
        fields = ("date", "value")
