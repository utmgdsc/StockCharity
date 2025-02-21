import requests

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status 

from django.shortcuts import render, redirect

import json
import os # for environmental variables
import stripe

STRIPE_PUBLIC_KEY = os.environ["STRIPE_PUBLIC_KEY"]
STRIPE_SECRET_KEY = os.environ["STRIPE_SECRET_KEY"]

@api_view(['POST'])
def payment_attempt_received(request):
    stripe.api_key = STRIPE_SECRET_KEY

    return Response("Testing")