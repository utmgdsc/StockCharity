import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status 
import json

@api_view(['POST'])
def payment_attempt_received(request):
    """
    Makes api calls to verify payment and sends an email to the user
    """
    # TODO: Calls payment api

    # Placeholder data # TODO: Please change
    data = {
        "receiver": "therealstockcharity@gmail.com",
        "charity": "charity1"
    }
    
    # Calls the email api to send payment successful email
    if True: # TODO: change the placeholder boolean to reflect if request is successful
        print("payment_attempt: posting to /api/send_payment_recieved_email")
        response = requests.post(request.build_absolute_uri("/") + "api/send_payment_recieved_email", json=data)
        print("payment_attempt: received response from /api/send_payment_recieved_email")
    return Response("", status=response.status_code)
