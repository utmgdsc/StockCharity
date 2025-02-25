from django.test import TestCase
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer 

User = get_user_model()

class UserManagerTest(TestCase):

    def test_create_user_with_phone_number(self):
        """Should create a user when phone_number is provided."""
        user = User.objects.create_user(
            email="test@example.com",
            password="securepassword",
            phone_number="+1234567890"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.phone_number, "+1234567890")
        self.assertTrue(user.check_password("securepassword"))
        self.assertFalse(user.is_staff)  # Regular users should not be staff
        self.assertFalse(user.is_superuser)  # Regular users should not be superusers

    def test_create_user_without_phone_number_raises_error(self):
        """Should raise a ValueError if phone_number is missing."""
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(
                email="test@example.com",
                password="securepassword",
                phone_number=None  # Missing phone number
            )
        self.assertEqual(str(context.exception), "Phone number is required")

    def test_create_superuser_with_phone_number(self):
        """Should create a superuser when phone_number is provided."""
        superuser = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpassword",
            phone_number="+1987654321"
        )
        self.assertEqual(superuser.email, "admin@example.com")
        self.assertEqual(superuser.phone_number, "+1987654321")
        self.assertTrue(superuser.is_staff)  # Superusers should be staff
        self.assertTrue(superuser.is_superuser)  # Superusers should be superusers

    def test_create_superuser_without_phone_number_raises_error(self):
        """Should raise a ValueError if phone_number is missing for a superuser."""
        with self.assertRaises(ValueError) as context:
            User.objects.create_superuser(
                email="admin@example.com",
                password="adminpassword",
                phone_number=None  # Missing phone number
            )
        self.assertEqual(str(context.exception), "Phone number is required")

class UserSerializerTest(TestCase):

    def test_valid_serializer_creates_user(self):
        """Should create a user when valid data is provided."""
        data = {
            "email": "test@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "1234567890",
            "password1": "securepassword",
            "password2": "securepassword"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors) 
        user = serializer.save() 
        
        self.assertEqual(user["email"], "test@example.com")
        self.assertEqual(user["phone_number"], "1234567890")

    def test_serializer_fails_when_phone_number_is_missing(self):
        """Should fail validation when phone_number is missing."""
        data = {
            "email": "test@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password1": "securepassword",
            "password2": "securepassword"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())  
        self.assertIn("phone_number", serializer.errors)

    def test_serializer_fails_when_phone_number_is_invalid(self):
        """Should fail validation when phone_number is not numeric."""
        data = {
            "email": "test@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "invalid_phone",
            "password1": "securepassword",
            "password2": "securepassword"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())  
        self.assertIn("phone_number", serializer.errors)