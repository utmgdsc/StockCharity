from rest_framework import serializers
from .models import Charity

class CharitySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    donations_received = serializers.FloatField(required=False)

    class Meta:
        model = Charity
        fields = [
            "id",
            "email",
            "name",
            "phone_number",
            "donations_received"
        ]
