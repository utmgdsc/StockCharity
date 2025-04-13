import os
import stripe

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


stripe.api_key = os.environ["STRIPE_SECRET_KEY"]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def donation_handler(request):
    donate_amount = request.data.get("amount")  # "10" | "25" | "50"
    fixed_donation = request.data.get("fixed")  # "true" | "false"
    # TODO:
    # the /success page should have this format: "http://public_domain/success?session_id={CHECKOUT_SESSION_ID}"
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": amount_to_price_id(fixed_donation, donate_amount),
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url="http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",  # this should route to the /success page
            cancel_url="http://localhost:3000/donate",  # this should route back to the donate page
        )
        return Response({"url": checkout_session.url}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def amount_to_price_id(fixed_donation, donate_amount):
    # These price IDs are obtained from the price screen on Stripe
    # They are hardcoded since I don't really know where to put them
    # They should probably be in an .env file
    match (fixed_donation, donate_amount):
        case ("true", "10"):
            return os.environ["10_DOLLAR_DONATION_PRICE_ID"]
        case ("true", "25"):
            return os.environ["25_DOLLAR_DONATION_PRICE_ID"]
        case ("true", "50"):
            return os.environ["50_DOLLAR_DONATION_PRICE_ID"]
        case ("false", _):
            return os.environ["ANY_DOLLAR_DONATION_PRICE_ID"]
