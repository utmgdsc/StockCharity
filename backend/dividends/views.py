from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import time

from .models import DividendReceived
from .serializers import DividendReceivedSerializer

class DividendViewSet(viewsets.ModelViewSet):

    queryset = DividendReceived.objects.all()

    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)

    # def create(self, request):
    #     pass

    # @action(detail=False, methods=['get'], url_path='orders_with_status')
    # def get_orders_with_status(self, request) -> list:
    #     """This method takes in a string for status and returns all the orders with that status.
        
    #     Example call: http://127.0.0.1:8000/order/orders_with_status/?order_status=test"""
    #     order_status = request.query_params.get('order_status')
    #     if order_status is None:
    #         return Response({'error' : 'status_of_order parameter is required.'}, status=400)
        
    #     orders = DonationOrder.objects.filter(status=order_status)
    #     serializer = self.get_serializer(orders, many=True)
    #     return Response({'orders_with_status': serializer.data}, status=200)
    
    # @action(detail=False, methods=['get'], url_path='orders-in-timeframe')
    # def get_orders_in_timeframe(self, request) -> list:
    #     """This method takes in a start and end date and returns all the orders within the given timeframe.
    #     It will default to 2025-01-01T00:00:00Z as the start date and the current date for the end date if
    #     no dates are given.

    #     You can input dates in either yyyy-mm-dd format or yyyy-mm-ddThh:mm:ssZ format.
        
    #     Example call: http://127.0.0.1:8000/order/orders-in-timeframe/?start_date=2025-01-02&end_date=2025-02-18"""
    #     start_date = request.query_params.get('start_date')
    #     end_date = request.query_params.get('end_date')

    #     # if start_date is None and end_date is None:
    #     #     return Response({'error' : 'start_date and end_date parameters are required.'}, status=400)
        
    #     # Default date/time
    #     if start_date is None:
    #         start_date = "2025-01-01T00:00:00Z"
    #     if end_date is None:
    #         end_date = date.today().strftime("%Y-%m-%dT%H:%M:%SZ")

    #     if len(start_date) == 10 and len(end_date) == 10:
    #         # Validate date format
    #         try:
    #             start_date_obj = date.fromisoformat(start_date[:10])
    #             end_date_obj = date.fromisoformat(end_date[:10])
    #         except ValueError:
    #             return Response({'error': 'Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ'}, status=400)

    #         # Reformatting dates
    #         if len(start_date) == 10:
    #             start_date += "T00:00:00Z"
    #         if len(end_date) == 10:
    #             end_date += "T23:59:59Z"

        
    #     # return Response({'start-date' : start_date, 'end-date' : end_date})
    #     try:
    #         orders = DonationOrder.objects.filter(time__range=[start_date, end_date])
    #     except:
    #         return Response({'error': "Please make sure you entered the dates correctly."})
            
    #     serializer = self.get_serializer(orders, many=True)
    #     return Response({'orders_in_timeframe': serializer.data}, status=200)
    
    # @action(detail=False, methods=['get'], url_path='stripe-id-order')
    # def get_order_by_stripe_id(self, request):
    #     """This method takes a stripe-id and returns the Donation_order that coresponds to it
        
    #     Example call http://127.0.0.1:8000/order/stripe-id-order/?stripe-id=123456789"""
    #     stripe_id = request.query_params.get('stripe-id')
    #     if stripe_id is None:
    #         return Response({'error': 'stripe-id parameter is required.'}, status=400)

    #     order = DonationOrder.objects.filter(stripe_transaction_id=stripe_id).first()

    #     if order is None:
    #         return Response({'error': 'There is no order with that stripe-id.'}, status=404)

    #     serializer = self.get_serializer(order)
    #     return Response({'order': serializer.data}, status=200)
    
    # @action(detail=False, methods=['get'], url_path='id-order')
    # def get_order_by_id(self, request):
    #     """This method takes an id and returns the Donation_order with that id
        
    #     Example call: http://127.0.0.1:8000/order/id-order/?id=4"""

    #     order_id = request.query_params.get('id')
    #     if order_id is None:
    #         return Response({'error': 'id parameter is required.'}, status=400)
        
    #     order = DonationOrder.objects.filter(id=order_id).first()

    #     if order is None:
    #         return Response({'error': ('There is no order with the id ', order_id)}, status=404)

    #     serializer = self.get_serializer(order)
    #     return Response({'order': serializer.data}, status=200)
    
    # @action(detail=False, methods=['get'], url_path='orders-within-cash-range')
    # def get_orders_in_cash_range(self, request):
    #     """This method takes low and high as inputs and returns all the Donation_orders with donation_totals 
    #     within that range.
        
    #     Example call: http://127.0.0.1:8000/order/orders-within-cash-range/?low=30&high=500"""
    #     lower_bound = request.query_params.get("low")
    #     if lower_bound is None:
    #         lower_bound = 0
        
    #     upper_bound = request.query_params.get("high")
    #     if upper_bound is None:
    #         return Response({'error': 'high parameter is required'}, status=404) 
        
    #     orders = DonationOrder.objects.filter(donation_total__gte=lower_bound, donation_total__lte=upper_bound)
    #     serializer = self.get_serializer(orders, many=True)
    #     return Response({'orders_within_cash_range': serializer.data}, status=200)