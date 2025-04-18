from django.urls import path
from .views import *

urlpatterns = [
    path("payment-attempt", payment_attempt_received, name="payment-attempt"),
    path(
        "send-payment-recieved-email",
        send_payment_recieved_email,
        name="payment-recieved-email",
    ),
    path("check-dividends", check_dividends, name="check-dividends"),
    path('donation', donation_handler, name='donation'),
    path('success', success_handler, name='success')
]
