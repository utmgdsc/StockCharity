import os
import stripe
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]


@api_view(['POST'])
def donation_handler(request):
    amount = request.data.get('amount')
    fixed = request.data.get('fixed')

    if (fixed == "true"):
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price": "price_1QuK2kLtztZ9KxoQVWS2Hdm5", 
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url="https://google.com",
                cancel_url="https://google.com"
            )
            return Response({"url": checkout_session.url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
