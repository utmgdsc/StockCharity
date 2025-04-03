# from django.shortcuts import render
from django.db.models import Sum

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from django_filters import FilterSet

from .models import DonationOrder
from .serializers import DonationOrderSerializer
from backend.permissions import DisableUserDelete, DisableUserUpdate


class DonationViewSet(viewsets.ModelViewSet):

    queryset = DonationOrder.objects.all()
    serializer_class = DonationOrderSerializer
    permission_classes = [DisableUserDelete, DisableUserUpdate]

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

    @action(detail=False, methods=["get"], url_path="total", permission_classes=[AllowAny])
    def get_total_donations(self, request) -> float:
        """This method will return the total value of all donations

        Example call: http://127.0.0.1:8000/order/total-donations/"""
        total_donations = self.filter_queryset(DonationOrder.objects.all()).aggregate(
            total=Sum("amount")
        )["total"] or 0
        return Response({"donation_total": total_donations}, status=200)
    

    def get_account_donations(self, request):
        """This method will return a 2-dimensional list of all the donations
        made by a user. The first row will be the donation amount and the second
        row will be the date of the donation"""

        donation_amounts = []
        donation_dates = []

        donations = self.filter_queryset(self.get_queryset().filter(account=request.user))
        
        for donation in donations:
            donation_amounts.append(donation.amount)
            donation_dates.append(donation.date) 
        donation_list = [donation_amounts, donation_dates]
        # donation_list = [
        #     [donation.amount, donation.date] for donation in donations
        # ]
        return Response({"donations_list": donation_list}, status=200)
