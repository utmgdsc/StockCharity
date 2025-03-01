from rest_framework import serializers
from .models import DividendReceived

class DividendReceivedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DividendReceived
        fields = ("id", "date", "value")

    def validate(self, attrs):
        print(type(attrs.get("value")))
        if attrs.get("value") < 0:
            raise serializers.ValidationError({"value": "Dividend should be positive"})
        return super().validate(attrs)
