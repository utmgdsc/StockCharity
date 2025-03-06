from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Charity

EMAIL = "some@email.com"
NAME = "Charity"
PHONE_NO = 123123123

class DividendTestCase(APITestCase):

    def create_charity(self):
        url = reverse("charity-list")
        data = {
            "email": EMAIL,
            "name": NAME,
            "phone_number": PHONE_NO
            }
        return self.client.post(url, data, format="json")
    
    def update_donation_received(self):
        url = reverse("increase-donated")
        data = {
            "donation": 1
            }
        return self.client.post(url, data, format="json")

    def test_create_charity_ok(self):
        response = self.create_charity()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Charity.objects.count(), 1)

    def test_create_charity_bad(self):
        self.create_charity()
        response = self.create_charity()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Charity.objects.count(), 1)
