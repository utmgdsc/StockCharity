from rest_framework import serializers
from .models import DividendReceived

class DividendReceivedSerializer(serializers.HyperlinkedModelSerializer):
    
    date = serializers.DateField(required=False)
    value = serializers.FloatField(required=True)

    class Meta:
        model = DividendReceived
        fields = ("id", "date", "value")

    def validate(self, attrs):
        if attrs.get("value") < 0:
            print("invalid somehow")
            raise serializers.ValidationError({"value": "Dividend should be positive"})
        return super().validate(attrs)
