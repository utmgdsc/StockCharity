from rest_framework import serializers
from .models import Charity
from rest_framework.validators import UniqueValidator


class CharitySerializer(serializers.ModelSerializer):
    charity_email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(Charity.objects.all(), message="Email already registered")
        ],
    )

    charity_name = serializers.CharField(required=True)
    charity_phone_number = serializers.CharField(required=True)
    donations_received = serializers.FloatField(required=False)
    is_approved = serializers.BooleanField(required=False)


    contact_first_name = serializers.CharField(required=True)
    contact_last_name = serializers.CharField(required=True)
    contact_phone_number = serializers.CharField(required=True)
    contact_email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(Charity.objects.all(), message="Email already registered")
        ],
    )

    class Meta:
        model = Charity
        fields = [
            "id",
            "charity_email",
            "charity_name",
            "charity_phone_number",
            "contact_first_name",
            "contact_last_name",
            "contact_email",
            "contact_phone_number",
            "donations_received",
            "is_approved",
            "logo_path",
        ]

    def create(self, validated_data):
        if "is_approved" in validated_data:
            del validated_data["is_approved"]
        return super().create(validated_data)


class CharityDonationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Charity
        fields = [
            "id",
            "charity_name",
            "donations_received",
            "description",
            "logo_path",
        ]
