from django.contrib.auth import get_user_model

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ["email", "first_name", "last_name", "phone_number", "is_staff", "is_active", "password1", "password2", "total_donations", "total_dividends"]

    def validate(self, attrs):
        if attrs.get("password1") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Passwords do not match"})

        phone_number = attrs.get("phone_number", "").lstrip("+")
        if not phone_number.isdigit() or len(phone_number) < 10:
            raise serializers.ValidationError({"phone_number": "Invalid phone number format"})

        # Update sanitized phone number in attrs
        attrs["phone_number"] = phone_number

        if not attrs.get("phone_number").isdigit() or len(attrs.get("phone_number")) < 10:
            raise serializers.ValidationError({"phone_number": "Invalid phone number format"})

        return super().validate(attrs)

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password1")
        phone_number = validated_data.pop("phone_number")
        validated_data.pop("password2")
        user = get_user_model().objects.create_user(email, phone_number, password, **validated_data)
        user.save()
        return super().to_representation(user)