from django.db.models import Sum

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from django_filters import FilterSet

from .models import DividendReceived
from .serializers import DividendReceivedSerializer

START_DATE = "2025-01-01"

class DividendViewSet(viewsets.ModelViewSet):

    queryset = DividendReceived.objects.all()
    serializer_class = DividendReceivedSerializer

    class DividendFilter(FilterSet):
        class Meta:
            model = DividendReceived
            fields = {"date": ["gte", "lte"]}

    filterset_class = DividendFilter

    @action(detail=False, methods=["get"], url_path="total", url_name="total")
    def get_total_dividends_in_timeframe(self, request) -> list:
        """This method returns the sum of all the dividends within the given timeframe.
        You can input dates in yyyy-mm-dd format.

        If no start_date is specified, it will be set to the oldest date in the database.
        If no end_date is specified, it will be set to the current date.

        Example call: http://127.0.0.1:8000/dividend/get_total_dividends_in_timeframe/?start_date=2025-01-02&end_date=2025-02-18
        """
        total_dividends = self.filter_queryset(self.get_queryset()).aggregate(
            Sum("value")
        )["value__sum"]
        if not total_dividends:
            total_dividends = 0
        return Response({"total_dividends": total_dividends}, status=200)
