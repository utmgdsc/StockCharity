from django.urls import reverse
from django.conf import settings

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Charity

EMAIL = "some@email.com"
NAME = "Charity"
PHONE_NO = "123123123"
DESCRIPTION = "A charity organization"
CONTACT_FIRST_NAME = "John"
CONTACT_LAST_NAME = "Doe"
CONTACT_EMAIL = "contact@email.com"
CONTACT_PHONE_NO = "987654321"


class DividendTestCase(APITestCase):

    def create_charity(self):
        url = reverse("charity-list")
        data = {
            "charity_email": EMAIL,
            "charity_name": NAME,
            "charity_phone_number": PHONE_NO,
            "charity_description": DESCRIPTION,
            "contact_first_name": CONTACT_FIRST_NAME,
            "contact_last_name": CONTACT_LAST_NAME,
            "contact_email": CONTACT_EMAIL,
            "contact_phone_number": CONTACT_PHONE_NO,
        }
        return self.client.post(url, data, format="json")

    def update_donation_received(self, charity_id, donation_amount):
        url = reverse("charity-increase-donations-received", args=[charity_id])
        data = {"secret": settings.SECRET_KEY, "donation": donation_amount}
        return self.client.patch(url, data, format="json")

    def test_create_charity_ok(self):
        response = self.create_charity()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(Charity.objects.count(), 1)

    def test_create_charity_bad(self):
        self.create_charity()
        response = self.create_charity()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Charity.objects.count(), 1)

    def test_update_donation_received(self):
        charity_response = self.create_charity()
        charity_id = charity_response.data["id"] 
        response = self.update_donation_received(charity_id, 10)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {"donations_received": 10},
        )
