from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import stripe
from django.conf import settings
from orders.models import DonationOrder
import os

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]


@api_view(['POST'])
def success_handler(request):
    """
    Handles successful Stripe donations.
    Expects body: { session_id: string }
    """
    print("Success handler called")
    
    # Check if the user is authenticated
    user = request.user
    if not user.is_authenticated:
        return Response({'error': 'Requires auth'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if the request contains a session_id
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({'error': 'Requires stripe session id'}, status=status.HTTP_400_BAD_REQUEST)
    
    print(f"Parsed session_id: {session_id}") 

    return Response({'message': 'Success handler called'}, status=status.HTTP_200_OK)

    # https://docs.stripe.com/api/checkout/sessions
    try:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        amount_total = checkout_session.amount_total / 100  # Convert cents to dollars
        DonationOrder.objects.create(
            amount=amount_total,
            account=user,
            date=now(),
            status='completed',
            stripe_transaction_id=checkout_session.payment_intent # https://docs.stripe.com/api/payment_intents
        )
        user.total_donations += amount_total
        user.save()
        return Response({'message': 'Donation recorded successfully.'}, status=status.HTTP_201_CREATED)
    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
