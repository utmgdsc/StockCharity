# from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import date
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated



from .models import DonationOrder
from .serializers import DonationOrderSerializer
from .models import User

class OrderViewSet(viewsets.ModelViewSet):

    queryset = DonationOrder.objects.all()
    serializer_class = DonationOrderSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    # Will impliment once accounts are fully implimented
    # @action(detail=False, methods=['get'], url_path='user-donations')
    # def all_donations_from_user(self, request):
    #     user = request.user 
    #     donations = DonationOrder.objects.filter(user=user)
    #     serializer = self.get_serializer(donations, many=True)
    #     return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create_order', permission_classes=[IsAuthenticated])
    def create_order(self, request, *args, **kwargs):
       '''
       1- create a JWT token using the postman  http://127.0.0.1:8000/login/ 
       2- use the create access token to create order 
                http://127.0.0.1:8000/order/create_order/

                {
               "donation_total": 3500,
                "time": "2025-03-03T22:35",
                "status": "inProg",
                "stripe_transaction_id": "5600"
                }

       '''
       request_data = request.data.copy()  # Make a mutable copy of the request data
        
       
       user = User.objects.get(email =request.user )

       try:
            donation_order = DonationOrder.objects.create(
                donation_total=request_data.get('donation_total'),
                account= user,  # Assigns the logged-in user
                time=request_data.get('time'),
                status=request_data.get('status'),  # Default status
                stripe_transaction_id=request_data.get('stripe_transaction_id'),
            )
            return Response("success", status=200)

       except Exception as e:
            return Response({"error": str(e)}, status=400)
        
    
   

    @action(detail=False, methods=['patch'], url_path='update_order',permission_classes=[IsAuthenticated])
    def update_order(self, request, *args, **kwargs):
       '''
       1- create a JWT token using the postman  http://127.0.0.1:8000/login/ 
       2- use the create access token to create order 
                http://127.0.0.1:8000/order/update_order/

                {
                "id"=1,
               "donation_total": 3500,
                "time": "2025-03-03T22:35",
                "status": "inProg",
                "stripe_transaction_id": "5600"
                }

       '''
       #need to get the loged in user 
       user = User.objects.get(email =request.user )
       request_data = request.data.copy()  # Make a mutable copy of request data

       try:
            # Fetch order by ID
            order = DonationOrder.objects.get(id=request_data.get('id'))
            
       except DonationOrder.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        #before you update make sure that the item belong to the user
       print(order.account)
       print(user)
       if order.account != user:
        return Response({"error": "Order dose not belong to the user"}, status=404)

        # Update fields if they exist in request
       if 'status' in request_data:
            order.status = request_data['status']
       if 'donation_total' in request_data:
            order.donation_total = request_data['donation_total']
       if 'time' in request_data:
            order.time = request_data['time']
       if 'stripe_transaction_id' in request_data:
            order.stripe_transaction_id = request_data['stripe_transaction_id']

        # Save changes
       order.save()

       return Response({
            "message": "Order updated successfully",
            "order_id": order.id,
            "status": order.status
       }, status=200)

    @action(detail=False, methods=['get'], url_path='total-donations')
    def get_total_donations(self, request) -> float:
        """This method will return the total value of all donations
        
        Example call: http://127.0.0.1:8000/order/total-donations/"""
        total_donations = DonationOrder.objects.aggregate(total=Sum('donation_total'))['total']
        return Response({'donation_total': total_donations}, status=200)

    @action(detail=False, methods=['get'], url_path='orders_with_status')
    def get_orders_with_status(self, request) -> list:
        """This method takes in a string for status and returns all the orders with that status.
        
        Example call: http://127.0.0.1:8000/order/orders_with_status/?order_status=test"""
        order_status = request.query_params.get('order_status')
        if order_status is None:
            return Response({'error' : 'status_of_order parameter is required.'}, status=400)
        
        orders = DonationOrder.objects.filter(status=order_status)
        serializer = self.get_serializer(orders, many=True)
        return Response({'orders_with_status': serializer.data}, status=200)
    
    @action(detail=False, methods=['get'], url_path='orders-in-timeframe')
    def get_orders_in_timeframe(self, request) -> list:
        """This method takes in a start and end date and returns all the orders within the given timeframe.
        It will default to 2025-01-01T00:00:00Z as the start date and the current date for the end date if
        no dates are given.

        You can input dates in either yyyy-mm-dd format or yyyy-mm-ddThh:mm:ssZ format.
        
        Example call: http://127.0.0.1:8000/order/orders-in-timeframe/?start_date=2025-01-02&end_date=2025-02-18"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # if start_date is None and end_date is None:
        #     return Response({'error' : 'start_date and end_date parameters are required.'}, status=400)
        
        # Default date/time
        if start_date is None:
            start_date = "2025-01-01T00:00:00Z"
        if end_date is None:
            end_date = date.today().strftime("%Y-%m-%dT%H:%M:%SZ")

        if len(start_date) == 10 and len(end_date) == 10:
            # Validate date format
            try:
                start_date_obj = date.fromisoformat(start_date[:10])
                end_date_obj = date.fromisoformat(end_date[:10])
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ'}, status=400)

            # Reformatting dates
            if len(start_date) == 10:
                start_date += "T00:00:00Z"
            if len(end_date) == 10:
                end_date += "T23:59:59Z"

        
        # return Response({'start-date' : start_date, 'end-date' : end_date})
        try:
            orders = DonationOrder.objects.filter(time__range=[start_date, end_date])
        except:
            return Response({'error': "Please make sure you entered the dates correctly."})
            
        serializer = self.get_serializer(orders, many=True)
        return Response({'orders_in_timeframe': serializer.data}, status=200)
    
    @action(detail=False, methods=['get'], url_path='stripe-id-order')
    def get_order_by_stripe_id(self, request):
        """This method takes a stripe-id and returns the Donation_order that coresponds to it
        
        Example call http://127.0.0.1:8000/order/stripe-id-order/?stripe-id=123456789"""
        stripe_id = request.query_params.get('stripe-id')
        if stripe_id is None:
            return Response({'error': 'stripe-id parameter is required.'}, status=400)

        order = DonationOrder.objects.filter(stripe_transaction_id=stripe_id).first()

        if order is None:
            return Response({'error': 'There is no order with that stripe-id.'}, status=404)

        serializer = self.get_serializer(order)
        return Response({'order': serializer.data}, status=200)
    
    @action(detail=False, methods=['get'], url_path='id-order')
    def get_order_by_id(self, request):
        """This method takes an id and returns the Donation_order with that id
        
        Example call: http://127.0.0.1:8000/order/id-order/?id=4"""

        order_id = request.query_params.get('id')
        if order_id is None:
            return Response({'error': 'id parameter is required.'}, status=400)
        
        order = DonationOrder.objects.filter(id=order_id).first()

        if order is None:
            return Response({'error': ('There is no order with the id ', order_id)}, status=404)

        serializer = self.get_serializer(order)
        return Response({'order': serializer.data}, status=200)
    
    @action(detail=False, methods=['get'], url_path='orders-within-cash-range')
    def get_orders_in_cash_range(self, request):
        """This method takes low and high as inputs and returns all the Donation_orders with donation_totals 
        within that range.
        
        Example call: http://127.0.0.1:8000/order/orders-within-cash-range/?low=30&high=500"""
        lower_bound = request.query_params.get("low")
        if lower_bound is None:
            lower_bound = 0
        
        upper_bound = request.query_params.get("high")
        if upper_bound is None:
            return Response({'error': 'high parameter is required'}, status=404) 
        
        orders = DonationOrder.objects.filter(donation_total__gte=lower_bound, donation_total__lte=upper_bound)
        serializer = self.get_serializer(orders, many=True)
        return Response({'orders_within_cash_range': serializer.data}, status=200)