from django.db.models import Sum

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Charity
from .serializers import CharitySerializer, CharityDonationSerializer
from backend.permissions import DisableUserDelete, DisableUserUpdate


# Create your views here.
class CharityViewSet(viewsets.ModelViewSet):

    queryset = Charity.objects.all()
    serializer_class = CharitySerializer
    permission_classes = [DisableUserDelete, DisableUserUpdate]

    @action(detail=True, methods=["patch"], url_path="increase-donated")
    def increase_donations_received(self, request, pk=None):
        """This method increases donations_received by the given amount

        Example call: http://127.0.0.1:8000/charity/1/increase-donated/  -d "{\"donation\": 100}"
        """

        charity_id = pk
        donation_increase = request.data.get("donation")

        if charity_id is None or donation_increase is None:
            return Response(
                {"error": "charity_id and donation are required fields."}, status=400
            )

        try:
            charity = Charity.objects.get(id=charity_id)
            donation_increase = float(donation_increase)
        except Charity.DoesNotExist:
            return Response({"error": "Charity not found."}, status=404)
        except ValueError:
            return Response({"error": "Donation must be a number."}, status=400)

        charity.donations_received += donation_increase
        charity.save()

        return Response(
            {"donations_received": charity.donations_received},
            status=200,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="all-donations",
        url_name="all-donations",
    )
    def get_charity_donations(self, request):
        """This method returns the amount earned by each approved charity till date

        Example call: http://127.0.0.1:8000/charity/all-donations/
        """
        approved_charities = self.get_queryset().filter(is_approved=True)
        return Response(
            CharityDonationSerializer(approved_charities, many=True).data,
            status=200,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="total-donations",
        url_name="total-donations",
    )
    def get_total_donations(self, request):
        """This method returns the total amount earned by all approved charities till date

        Example call: http://127.0.0.1:8000/charity/total-donations/
        """
        return Response(
            {
                "amount": self.get_queryset()
                .filter(is_approved=True)
                .aggregate(Sum("donations_received"))["donations_received__sum"]
            },
            status=200,
        )
