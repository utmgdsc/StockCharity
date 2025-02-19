from django.urls import path
from .views import *

urlpatterns = [
    path('payment_attempt', payment_attempt_received, name='payment_attempt'),
    path('send_payment_recieved_email', send_payment_recieved_email, name='payment_recieved_email')
]
