from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import DividendReceived
from datetime import date, timedelta

VALUE1 = 3.1
DATE1 = date(2025, 1, 23)
DATA1 = {
    "id": 1,
    "date": str(DATE1),
    "value": VALUE1,
}


VALUE2 = 2.0
DATA2 = {
    "id": 2,
    "date": str(date.today()),
    "value": VALUE2,
}


class DividendTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.mock_dividend = DividendReceived.objects.create(value=VALUE1, date=DATE1)

    def create_dividend(self):
        url = reverse("dividend-list")
        data = {"value": VALUE2}
        return self.client.post(url, data, format="json")

    def get_dividends_in_timeframe(self, start_date=None, end_date=None):
        url = reverse("dividend-list")

        if start_date or end_date:
            url += "?"
        if start_date:
            url += f"date__gte={start_date}"
            if end_date:
                url += "&"
        if end_date:
            url += f"date__lte={end_date}"

        return self.client.get(url)

    def get_total_dividends_in_timeframe(self, start_date=None, end_date=None):
        url = reverse("dividend-total")

        if start_date or end_date:
            url += "?"
        if start_date:
            url += f"date__gte={start_date}"
            if end_date:
                url += "&"
        if end_date:
            url += f"date__lte={end_date}"

        return self.client.get(url)

    def test_create_dividend_ok(self):
        response = self.create_dividend()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DividendReceived.objects.count(), 2)

        created_dividend = DividendReceived.objects.filter(id=2).first()
        self.assertEqual(created_dividend.value, VALUE2, created_dividend)
        self.assertEqual(created_dividend.date, date.today())
        self.assertEqual(created_dividend.id, 2)

    def test_get_dividend_ok(self):
        url = reverse("dividend-list") + "1/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        expected_values = DATA1
        self.assertEqual(expected_values, response.data, response.data)

    def test_get_dividend_bad(self):
        url = reverse("dividend-list") + "5/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_dividends_in_timeframe_only_start_date(self):
        response = self.get_dividends_in_timeframe(start_date=str(DATE1))
        self.assertEqual([DATA1], response.data, response.data)

    def test_get_dividends_in_timeframe_only_end_date(self):
        response = self.get_dividends_in_timeframe(end_date=str(DATE1))
        self.assertEqual([DATA1], response.data, response.data)

    def test_get_dividends_in_timeframe_no_data(self):
        response = self.get_dividends_in_timeframe(
            start_date=str(DATE1 + timedelta(days=1)), end_date=str(date.today())
        )
        self.assertEqual([], response.data, response.data)

    def test_get_dividends_in_timeframe_partial_data(self):
        self.create_dividend()
        response = self.get_dividends_in_timeframe(
            start_date=str(DATE1), end_date=str(date.today() - timedelta(days=1))
        )
        self.assertEqual([DATA1], response.data, response.data)

    def test_get_dividends_in_timeframe_all_data(self):
        self.create_dividend()
        response = self.get_dividends_in_timeframe(
            start_date=str(DATE1), end_date=str(date.today())
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, [DATA1, DATA2])

    def test_get_total_dividends_in_timeframe_only_start_date(self):
        response = self.get_total_dividends_in_timeframe(start_date=str(DATE1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_values = {"total_dividends": VALUE1}
        self.assertEqual(expected_values, response.data, response.data)

    def test_get_total_dividends_in_timeframe_only_end_date(self):
        response = self.get_total_dividends_in_timeframe(end_date=str(DATE1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_values = {"total_dividends": VALUE1}
        self.assertEqual(expected_values, response.data, response.data)

    def test_get_total_dividends_in_timeframe_no_data(self):
        response = self.get_total_dividends_in_timeframe(
            start_date=str(DATE1 + timedelta(days=1)), end_date=str(date.today())
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_values = {"total_dividends": 0}
        self.assertEqual(expected_values, response.data, response.data)

    def test_get_total_dividends_in_timeframe_all_data(self):
        self.create_dividend()
        response = self.get_total_dividends_in_timeframe(
            start_date=str(DATE1), end_date=str(date.today())
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_values = {"total_dividends": VALUE1 + VALUE2}
        self.assertEqual(expected_values, response.data, response.data)

    def test_get_total_dividends(self):
        response = self.get_total_dividends_in_timeframe()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_values = {"total_dividends": VALUE1}
        self.assertEqual(expected_values, response.data, response.data)
