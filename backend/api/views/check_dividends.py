import os
import requests
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status 
from datetime import date
from django.db.models import Sum
from accounts.models import User

MAX_RETRIES = 3
LIST_OF_STOCKS = {"ACNB": "whatever this is"}

@api_view(['GET'])
def check_dividends(request):
    """
    Makes api calls to check if we received any dividends and update our database
    """
    retries = 0
    total_dividend_earned = 0

    # Make API call to TIINGO to check for dividends
    for ticker, name in LIST_OF_STOCKS.items():
        while retries < MAX_RETRIES:
            print(f"check_dividends: getting {name} dividend data from TIINGO")
            today = str(date.today())
            url = f"https://api.tiingo.com/tiingo/daily/{ticker}/prices?startExDate{today}&endExDate={today}"
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + os.environ['TIINGO_API_KEY']
            }
            
            # Retry if the request failed
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"check_dividends: {name} dividend data was not retrieved (retries={retries})")
                print(f"check_dividends: status code {response.status_code}")
                retries += 1
                continue

            # Add dividend entry
            print(f"check_dividends: adding {name} dividend data to db")
            url = request.build_absolute_uri(reverse("dividend-list"))
            dividend = response.json()[0]["divCash"]
            data = {
                "value": dividend
                }
            
            # Retry if the request failed
            response = requests.post(url, data)       
            if response.status_code != 201:
                print(f"check_dividends: {name} dividend data was not added to db (retries={retries})")
                print(f"check_dividends: status code {response.status_code}")
                retries += 1
                continue

            # Update total dividend
            print(f"check_dividends: {name} dividend data is successfully retrieved")
            total_dividend_earned += dividend
            break
    

    # Update all users
    total_donated = User.objects.all().aggregate(
            Sum("total_donations")
        )["total_donations__sum"]
    
    for u in User.objects.all():
        dividend_portion = u.total_donations / total_donated
        u.total_dividends += total_dividend_earned * dividend_portion
        u.save()
    
    return Response("check_dividends: All dividends updated for users", status=200)
