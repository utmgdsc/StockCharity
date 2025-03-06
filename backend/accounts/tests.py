from rest_framework.test import APITestCase
from django.test import TestCase
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer
from django.urls import reverse
from rest_framework import status
from .models import User

User = get_user_model()

class UserManagerTest(TestCase):

    def test_create_user_with_phone_number(self):
        """Should create a user and store phone number without '+'."""
        user = User.objects.create_user(
            email="test@example.com",
            password="securepassword",
            phone_number="+1234567890"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.phone_number, "1234567890")  # Ensure '+' is removed
        self.assertTrue(user.check_password("securepassword"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

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
        """Should create a superuser and store phone number without '+'."""
        superuser = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpassword",
            phone_number="+1987654321"
        )
        self.assertEqual(superuser.email, "admin@example.com")
        self.assertEqual(superuser.phone_number, "1987654321")  # Ensure '+' is removed
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

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
        """Should create a user and store phone number without '+'."""
        data = {
            "email": "test@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "+1234567890",
            "password1": "securepassword",
            "password2": "securepassword"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()  # Save user and check stored phone number

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

class AccountTests(APITestCase):
    EMAIL = "email@domain.com"
    PASSWORD = "password1"
    FIRST_NAME = "first_name"
    LAST_NAME = "last_name"
    PHONE_NUMBER = '1234567890'

    def create_account(self):
        url = reverse("register")
        data = {
            "email": self.EMAIL,
            "password1": self.PASSWORD,
            "password2": self.PASSWORD,
            "first_name": self.FIRST_NAME,
            "last_name": self.LAST_NAME,
            "phone_number": self.PHONE_NUMBER
        }
        return self.client.post(url, data, format="json")

    def login(self):
        url = reverse("login")
        data = {
            "email": self.EMAIL,
            "password": self.PASSWORD,
            "phone_number": self.PHONE_NUMBER,
        }
        return self.client.post(url, data, format="json")

    def get_login_tokens(self):
        return self.login().data

    def test_create_account_ok(self):
        response = self.create_account()
        # HTTP returned created
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, msg=response.data
        )
        # Exactly 1 Account created
        self.assertEqual(User.objects.count(), 1)
        # Validate values being stored
        userObject = User.objects.get()
        self.assertEqual(userObject.email, self.EMAIL)
        self.assertEqual(userObject.first_name, self.FIRST_NAME)
        self.assertEqual(userObject.last_name, self.LAST_NAME)

    def test_create_account_duplicate_email(self):
        response = self.create_account()
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, msg=response.data
        )

        response = self.create_account()
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, msg=response.data
        )

    def test_login_ok(self):
        response = self.create_account()
        response = self.login()
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_bad(self):
        response = self.create_account()
        url = reverse("login")
        data = {
            "email": self.EMAIL,
            "password": self.PASSWORD + "a",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED, msg=response.data
        )

    def test_get_account_ok(self):
        url = reverse("account")
        self.create_account()
        token = self.get_login_tokens()["access"]
        response = self.client.get(
            url, format="json", headers={"Authorization": f"Bearer {token}"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        expected_values = {
            "email": self.EMAIL,
            "first_name": self.FIRST_NAME,
            "last_name": self.LAST_NAME,
        }
        for field in expected_values:
            self.assertIn(field, response.data)
            self.assertEqual(response.data[field], expected_values[field])

    def test_get_account_no_auth(self):
        url = reverse("account")
        response = self.client.get(url, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED, response.data
        )
