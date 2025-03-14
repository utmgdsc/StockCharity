from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import date

from .models import User
from .serializers import UserSerializer


class AccountViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        if request.auth is None:
            # Request is coming from an un-authorized user
            return Response(status=401)
        if pk is not None and int(pk) != request.user.id:
            # Request is coming from the authenticated user, 
            # but is trying to query other user's data
            return Response(status=403)
        # Serialize the user that authenticated request
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)

    def increase_donations_total(self, request, pk=None):
        """This method increases donations_total by the given amount

        Example cURL:
        curl -X PATCH http://127.0.0.1:8000/accounts/1/increase-donations/ -H "Content-Type: application/json" -d "{\"donation\": 100}"
        """

        user_id = pk
        donation_increase = request.data.get("donation")

        if user_id is None or donation_increase is None:
            return Response(
                {"error": "user_id and donation are required fields."}, status=400
            )

        try:
            user = User.objects.get(id=user_id)
            donation_increase = float(donation_increase)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)
        except ValueError:
            return Response({"error": "Donation must be a number."}, status=400)

        user.total_donations += donation_increase
        user.save()

        return Response(
            {
                "status": f"Donation added successfully. The new total is {user.total_donations}"
            },
            status=200,
        )

    def get_user_dividends_total(self, request, pk=None):
        """This method returns the dividends_total of a user

        Example cURL:
        curl -X GET http://127.0.0.1:8000/accounts/1/dividends/
        """
        user_id = pk

        if user_id is None:
            return Response({"error": "user_id is a required field."}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        dividends = user.total_dividends

        return Response({"dividends": dividends}, status=200)

    @action(detail=True, methods=["patch"], url_path="increase-dividends")
    def increase_dividends_total(self, request, pk=None):
        """This method increases dividends_total by the given amount

        Example cURL:
        curl -X PATCH http://127.0.0.1:8000/accounts/1/increase-dividends/ -H "Content-Type: application/json" -d "{\"dividend\": 100}"
        """

        user_id = pk
        dividend_increase = request.data.get("dividend")

        if user_id is None or dividend_increase is None:
            return Response(
                {"error": "user_id and dividend are required fields."}, status=400
            )

        try:
            user = User.objects.get(id=user_id)
            dividend_increase = float(dividend_increase)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)
        except ValueError:
            return Response(
                {"error": "Dividend increase must be a number."}, status=400
            )

        user.total_dividends += dividend_increase
        user.save()

        return Response(
            {
                "status": f"dividend added successfully. The new total is {user.total_dividends}"
            },
            status=200,
        )
