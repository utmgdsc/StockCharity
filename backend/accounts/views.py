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

    @action(detail=False, methods=["post"], url_path="add-user")
    def add_user(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    @action(detail=True, methods=["patch"], url_path="change-staff-status")
    def change_staff_status(self, request, pk=None):
        """
        This method will change the staff_status of a given user

        Example cURL
        curl -X PATCH http://127.0.0.1:8000/accounts/1/change-staff-status/ -H "Content-Type: application/json" -d "{\"is_staff\": true}"
        """

        user_id = pk
        new_is_staff = request.data.get("is_staff")

        if user_id is None or new_is_staff is None:
            return Response(
                {"error": "user_id and is_staff are required fields."}, status=400
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        user.is_staff = new_is_staff
        user.save()

        return Response({"status": "staff status updated successfully"}, status=200)

    @action(detail=True, methods=["patch"], url_path="change-active-status")
    def change_active_status(self, request, pk=None):
        """
        This method sets the is_active status of a user to the given status (either true or false)

        Example cURL
        curl -X PATCH http://127.0.0.1:8000/accounts/1/change-staff-status/ -H "Content-Type: application/json" -d "{\"is_staff\": true}
        """
        user_id = pk
        new_is_active = request.data.get("is_active")

        if user_id is None or new_is_active is None:
            return Response(
                {"error": "user_id and is_active are required fields."}, status=400
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        user.is_active = new_is_active
        user.save()

        return Response({"status": "active status updated successfully"}, status=200)

    @action(detail=True, methods=["patch"], url_path="change-email")
    def change_email(self, request, pk=None):
        """This method sets the email attached to a user to the given value

        Example cURL
        curl -X PATCH http://127.0.0.1:8000/accounts/1/change-email/ -H "Content-Type: application/json" -d "{\"email\": \"newemail@example.com\"}"
        """
        user_id = pk
        new_email = request.data.get("email")

        if user_id is None or new_email is None:
            return Response(
                {"error": "user_id and email are required fields."}, status=400
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        user.email = new_email
        user.save()

        return Response({"status": "email updated successfully"}, status=200)

    @action(detail=True, methods=["delete"], url_path="delete-user")
    def delete_user(self, request, pk=None):
        """
        This method will delete the given user

        Example cURL
        curl -X DELETE http://127.0.0.1:8000/accounts/1/delete-user/ -H "Content-Type: application/json"
        """
        user_id = pk

        if user_id is None:
            return Response({"error": "user_id is a required field."}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        user.delete()
        return Response({"status": "user deleted successfully"}, status=200)

    def retrieve(self, request):
        if request.auth is None:
            # Request is coming from an un-authorized user
            return Response(status=401)
        # Serialize the user that authenticated request
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)
    
    def list(self, request):
        """This method returns all the user info in the db

        Example cURL:
        curl -X GET http://127.0.0.1:8000/accounts/?include_staff=False
        """
        if request.auth is None:
            return Response({"error": "You are not logged in"}, status=401)
        serializer = self.get_serializer(request.user)
        if not serializer.data["is_staff"]:
            return Response({"error": "You are not staff"}, status=401)
        
        # The user is an authenticated staff member
        include_staff = request.query_params.get("include_staff")

        if include_staff == "True":
            user_set = self.queryset
        else: 
            user_set = self.queryset.filter(is_staff=False)
        
        return Response(self.get_serializer(user_set, many=True).data, status=200)

    @action(detail=True, methods=["get"], url_path="donations")
    def get_user_donations_total(self, request, pk=None):
        """This method returns the donations_total of a user

        Example cURL:
        curl -X GET http://127.0.0.1:8000/accounts/1/donations/
        """
        user_id = pk

        if user_id is None:
            return Response({"error": "user_id is a required field."}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        donations = user.total_donations

        return Response({"donations": donations}, status=200)

    @action(detail=True, methods=["patch"], url_path="increase-donations")
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
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        try:
            donation_increase = float(donation_increase)
        except ValueError:
            return Response({"error": "donation must be a number."}, status=400)

        user.total_donations += donation_increase
        user.save()

        return Response(
            {
                "status": f"donation added successfully. The new total is {user.total_donations}"
            },
            status=200,
        )

    @action(detail=True, methods=["get"], url_path="dividends")
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
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        user.total_dividends += dividend_increase
        user.save()

        return Response(
            {
                "status": f"dividend added successfully. The new total is {user.total_dividends}"
            },
            status=200,
        )
