import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status 
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

STOCK_CHARITY_EMAIL = "therealstockcharity@gmail.com"
EMAIL_MAX_RETRIES = 3

@api_view(['POST'])
def send_payment_recieved_email(request):
    """
    Sends an email to the user to notify them that their payment is successful 
    and thanks them for their kindness.

    expects the request.data to be a dict that looks like this
    {
        "receiver": "{their email}"
    }
    """
    print("send_payment_recieved_email: Trying to send email...")
    retries = 0
    while retries < EMAIL_MAX_RETRIES:
        # Try to send an email to the donator
        sg = sendgrid.SendGridAPIClient(api_key=os.environ["TWILIO_API_KEY"])
        from_email = Email(STOCK_CHARITY_EMAIL)
        to_email = To(request.data["receiver"])
        subject = "Thank you for supporting local charities!"
        content = Content("text/plain", f"Your support is what keeps the kindness at {request.data["charity"]} going <3")
        mail = Mail(from_email, to_email, subject, content)

        # Check if the response code
        response = sg.client.mail.send.post(request_body=mail.get())
        if response.status_code != 202:
            retries += 1
        else:
            print("send_payment_recieved_email: Email is sent!")
            # Return 200 OK if the email is sent successfully
            return Response("", status=status.HTTP_200_OK)

    print("send_payment_recieved_email: Email failed to send")
    # Return 400 Bad Request if the email is not sent
    return Response("", status=status.HTTP_400_BAD_REQUEST)
