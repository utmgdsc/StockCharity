from rest_framework import serializers
from .models import User

class User_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "is_staff", "is_active", "date_joined")

