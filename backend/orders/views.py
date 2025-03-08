# from django.shortcuts import render
from django.db.models import Sum

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from django_filters import FilterSet

from .models import DonationOrder
from .serializers import DonationOrderSerializer


class DonationViewSet(viewsets.ModelViewSet):

    queryset = DonationOrder.objects.all()
    serializer_class = DonationOrderSerializer

    class DonationFilter(FilterSet):
        class Meta:
            model = DonationOrder
            fields = {
                "date": ["gte", "lte"],
                "amount": ["gte", "lte"],
                "stripe_transaction_id": ["exact"],
                "status": ["exact"],
            }

    filterset_class = DonationFilter

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return super().get_queryset()
        else:
            return user.donations.all()

    @action(detail=False, methods=["get"], url_path="total")
    def get_total_donations(self, request) -> float:
        """This method will return the total value of all donations

        Example call: http://127.0.0.1:8000/order/total-donations/"""
        total_donations = self.filter_queryset(self.get_queryset()).aggregate(
            total=Sum("amount")
        )["total"]
        return Response({"donation_total": total_donations}, status=200)
