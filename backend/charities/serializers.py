from rest_framework import serializers
from .models import Charity
from rest_framework.validators import UniqueValidator


class CharitySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(Charity.objects.all(), message="Email already registered")
        ],
    )
    name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    donations_received = serializers.FloatField(required=False)
    is_approved = serializers.BooleanField(required=False)

    class Meta:
        model = Charity
        fields = [
            "id",
            "email",
            "name",
            "phone_number",
            "donations_received",
            "is_approved",
            "logo_path",
            "description",
        ]


class CharityDonationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Charity
        fields = [
            "id",
            "name",
            "donations_received",
        ]
