from django.contrib.auth import get_user_model

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ["email", "first_name", "last_name", "password1", "password2"]

    def validate(self, attrs):
        if attrs.get("password1") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return super().validate(attrs)

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        user = get_user_model().objects.create_user(email, password, **validated_data)
        user.save()
        return super().to_representation(user)
