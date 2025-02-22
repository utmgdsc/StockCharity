from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class AccountTests(APITestCase):
    EMAIL = "email@domain.com"
    PASSWORD = "password1"
    FIRST_NAME = "first_name"
    LAST_NAME = "last_name"

    def create_account(self):
        url = reverse("register")
        data = {
            "email": self.EMAIL,
            "password1": self.PASSWORD,
            "password2": self.PASSWORD,
            "first_name": self.FIRST_NAME,
            "last_name": self.LAST_NAME,
        }
        return self.client.post(url, data, format="json")

    def login(self):
        url = reverse("login")
        data = {
            "email": self.EMAIL,
            "password": self.PASSWORD,
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
        self.assertDictEqual(
            response.data,
            {
                "email": self.EMAIL,
                "first_name": self.FIRST_NAME,
                "last_name": self.LAST_NAME,
            },
        )

    def test_get_account_no_auth(self):
        url = reverse("account")
        response = self.client.get(url, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED, response.data
        )
