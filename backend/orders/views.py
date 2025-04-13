# from django.shortcuts import render
from django.db.models import Sum

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from django_filters import FilterSet
from django.db.models.functions import TruncMonth

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

    @action(
        detail=False, methods=["get"], url_path="total", permission_classes=[AllowAny]
    )
    def get_total_donations(self, request) -> float:
        """This method will return the total value of all donations

        Example call: http://127.0.0.1:8000/order/total-donations/"""
        total_donations = (
            self.filter_queryset(DonationOrder.objects.all()).aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )
        return Response({"donation_total": total_donations}, status=200)
    
    def get_donations_by_month(self, request):
        """This method will return a list of donations per month

        Example call: http://127.0.0.1:8000/monthly-donations/"""
        queryset = self.get_queryset()

        monthly_donations = (
            queryset.annotate(month=TruncMonth("date"))
            .values("month")
            .annotate(total_amount=Sum("amount"))
            .order_by("month")
        )

        if not monthly_donations:
            return Response({})

        donation_dict = {}
        for entry in monthly_donations:
            donation_dict[entry["month"].strftime("%b/%y")] = entry["total_amount"]

        start_month = monthly_donations[0]["month"].replace(day=1)
        end_month = monthly_donations[len(monthly_donations) - 1]["month"].replace(day=1)

        # Generate all months between start and end
        current = start_month
        result = []

        while current <= end_month:
            key = current.strftime("%b/%y")
            result.append({key: donation_dict.get(key, 0)}) 

            next_month = current.month % 12 + 1
            next_year = current.year + (current.month // 12)
            current = current.replace(
                year=next_year if next_month == 1 else current.year,
                month=next_month
            )
        
        return Response({"monthly_donations": result}, status=200)
