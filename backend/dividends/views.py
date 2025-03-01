from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import date

from .models import DividendReceived
from .serializers import DividendReceivedSerializer

START_DATE = "2025-01-01"

class DividendViewSet(viewsets.ModelViewSet):

    queryset = DividendReceived.objects.all()
    serializer_class = DividendReceivedSerializer

    def retrieve(self, request, pk=None):
        """
        Gives you the dividend with the corresponding id

        Example call: http://127.0.0.1:8000/dividend/12
        """
        print(f"dividend retrieve: getting id {[pk]}")
        try:
            dividend = self.queryset.get(pk=pk)

        except DividendReceived.DoesNotExist:
            return Response({'error': 'Invalid id'}, status=404)
        
        serializer = DividendReceivedSerializer(dividend)
        return Response(serializer.data, status=200)
    
    def create(self, request):
        print("dividend create: received data", request.data)
        serializer = DividendReceivedSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    @action(detail=False, methods=['get'], url_path='dividends-in-timeframe')
    def get_dividends_in_timeframe(self, request) -> list:
        """This method takes in a start and end date and returns all the dividends within the given timeframe.
        You can input dates in yyyy-mm-dd format.

        If no start_date is specified, it will be set to the oldest date in the database.
        If no end_date is specified, it will be set to the current date.
        
        Example call: http://127.0.0.1:8000/dividend/dividends-in-timeframe/?start_date=2025-01-02&end_date=2025-02-18"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date is None:
            start_date = "2025-01-01"
        
        if end_date is None:
            end_date = date.today()
    
        dividends_in_range = DividendReceived.objects.filter(date__range=[start_date, end_date])
        serializer = self.get_serializer(dividends_in_range, many=True)
        return Response({'get_dividends_in_timeframe': serializer.data}, status=200)

    @action(detail=False, methods=['get'], url_path='get_total_dividends_in_timeframe')
    def get_total_dividends_in_timeframe(self, request) -> list:
        """This method returns the sum of all the dividends within the given timeframe.
        You can input dates in yyyy-mm-dd format.

        If no start_date is specified, it will be set to the oldest date in the database.
        If no end_date is specified, it will be set to the current date.
        
        Example call: http://127.0.0.1:8000/dividend/get_total_dividends_in_timeframe/?start_date=2025-01-02&end_date=2025-02-18"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date is None:
            start_date = START_DATE
        
        if end_date is None:
            end_date = date.today()
    
        total_dividends = DividendReceived.objects.filter(date__range=[start_date, end_date]).aggregate(Sum("value"))["value__sum"]
        if not total_dividends:
            total_dividends = 0
        return Response({'total_dividends': total_dividends}, status=200)
    
    @action(detail=False, methods=['get'], url_path='get_total_dividends')
    def get_total_dividends(self, request) -> list:
        """This method returns the sum of all the dividends we have received.

        Example call: http://127.0.0.1:8000/dividend/get_total_dividends/"""
    
        return self.get_total_dividends_in_timeframe(request)
