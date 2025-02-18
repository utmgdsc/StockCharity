from django.urls import path
from .views import receive_payment

urlpatterns = [
    path('payment', receive_payment, name='payment')
]
