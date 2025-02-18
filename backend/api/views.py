from django.shortcuts import render
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status 
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

STOCK_CHARITY_EMAIL = "therealstockcharity@gmail.com"
EMAIL_MAX_RETRIES = 3

@api_view(['POST'])
def receive_payment(request):
    # TODO: Implement stripe API
    
    receiver_email = STOCK_CHARITY_EMAIL # TODO: change to the email we received


    # Return something when payment fails
    if False:
        return Response("", status=status.HTTP_400_BAD_REQUEST)
    
    # Payment successful, send user an email confirmation with twilio
    print("Trying to send email...")
    retries = 0
    while retries < EMAIL_MAX_RETRIES:
        sg = sendgrid.SendGridAPIClient(api_key=os.environ["TWILIO_API_KEY"])
        from_email = Email(STOCK_CHARITY_EMAIL)
        to_email = To(receiver_email)
        subject = "Thank you for supporting local charities!"
        content = Content("text/plain", "thanks for the money peasant")
        mail = Mail(from_email, to_email, subject, content)

        response = sg.client.mail.send.post(request_body=mail.get())
        if response.status_code != 202:
            retries += 1
        else:
            print("Email is sent!")
            # Return 200 OK if the email is sent successfully
            return Response("", status=status.HTTP_200_OK)

    print("Email failed to send bruh")
    # Return 202 Accepted if payment went through but the email is not sent
    return Response("", status=status.HTTP_202_ACCEPTED)

