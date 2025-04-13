from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action

from .models import Donation
from .serializers import DonationSerializer
from backend.permissions import DisableUserDelete, DisableUserUpdate


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [DisableUserDelete, DisableUserUpdate]

    @action(detail=False, methods=["get"], url_path="total")
    def total(self, request):
        # Aggregate the total donation amount
        total_amount = (
            self.get_queryset().aggregate(total=Sum("donation_amount"))["total"] or 0
        )
        return Response({"total_donated_amount": total_amount})

    # returns total donation amount for each charity
    @action(detail=False, methods=["get"], url_path="total-by-charity")
    def total_by_charity(self, request):
        # note the double underscore
        aggregated = (
            self.get_queryset()
            .values("charity", "charity__name")
            .annotate(total_donation=Sum("donation_amount"))
        )
        result = {
            entry["charity__name"]: entry["total_donation"] for entry in aggregated
        }
        return Response(result)
