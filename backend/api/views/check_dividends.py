import os
import requests
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date
from django.db.models import Sum
from accounts.models import User
from stock.models import Stock

MAX_RETRIES = 3

@api_view(['GET'])
def check_dividends(request):
    """
    Makes api calls to check if we received any dividends and update our database
    """
    total_dividend_earned = 0

    # Make API call to TIINGO to check for dividends
    for stock in Stock.objects.all():
        retries = 0
        while retries < MAX_RETRIES:
            print(f"check_dividends: getting {stock.symbol}: {stock.stock_name} dividend data from TIINGO")
            today = str(date.today())
            url = f"https://api.tiingo.com/tiingo/daily/{stock.symbol}/prices?startExDate{today}&endExDate={today}"
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + os.environ['TIINGO_API_KEY']
            }
            
            # Retry if the request failed
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"check_dividends: {stock.stock_name} dividend data was not retrieved (retries={retries})")
                print(f"check_dividends: status code {response.status_code}")
                retries += 1
                continue

            # Add dividend entry
            url = request.build_absolute_uri(reverse("dividend-list"))
            dividend = response.json()[0]["divCash"]
            data = {
                "value": dividend * stock.quantity
                }
            print(f"check_dividends: {stock.stock_name} ({stock.quantity} shares) made {dividend} per share")
            print(f"check_dividends: adding {stock.stock_name} dividend data to db")
            
            # Retry if the request failed
            response = requests.post(url, data)       
            if response.status_code != 201:
                print(f"check_dividends: {stock.stock_name} dividend data was not added to db (retries={retries})")
                print(f"check_dividends: status code {response.status_code}")
                retries += 1
                continue

            # Update total dividend
            print(f"check_dividends: {stock.stock_name} dividend data is successfully retrieved")
            total_dividend_earned += dividend * stock.quantity
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
