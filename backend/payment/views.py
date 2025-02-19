from django.shortcuts import render, redirect
from django.urls import reverse
import os # for environmental variables
import stripe

STRIPE_PUBLIC_KEY = os.environ["STRIPE_PUBLIC_KEY"]
STRIPE_SECRET_KEY = os.environ["STRIPE_SECRET_KEY"]

def home(request):
    stripe.api_key = STRIPE_SECRET_KEY
    if request.method == "POST":
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": "price_1QuK2kLtztZ9KxoQVWS2Hdm5", 
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=request.build_absolute_uri(reverse("success")),
            cancel_url=request.build_absolute_uri(reverse("cancel")),
        )
        return redirect(checkout_session.url, code=303)
    return render(request, "payment/home.html")


def success(request):
    return render(request, "payment/success.html")


def cancel(request):
    return render(request, "payment/cancel.html")