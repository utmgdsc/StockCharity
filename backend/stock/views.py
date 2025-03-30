import requests
import os
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Stock
from .serializers import StockSerializer
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Tiingo API Key
TIINGO_API_KEY = os.environ["TIINGO_API_KEY"]

class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class StockPortfolioView(APIView):
    """Fetches stock holdings and computes total investment"""

    def get_stock_price(self, symbol):
        """Fetch stock price from Tiingo API and return a valid float value"""
        try:
            print(f"Fetching stock price for: {symbol}")
            url = f"https://api.tiingo.com/iex/{symbol}?token={TIINGO_API_KEY}"
            response = requests.get(url)

            print(f"API Response ({symbol}):", response.status_code, response.text)

            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    price = data[0].get("tngoLast", 0.0) 
                    return price
            return 0.0
        except Exception as e:
            print(f"Error fetching stock price for {symbol}: {e}")
            return 0.0

    def get(self, request):
        """Handles GET request to return portfolio information"""
        try:
            print("Fetching stock holdings from database...")
            stocks = Stock.objects.all()

            portfolio = []
            total_investment = 0

            for stock in stocks:
                current_price = self.get_stock_price(stock.symbol)
                stock_value = current_price * stock.quantity
                total_investment += stock_value

                portfolio.append({
                    "stock_name": stock.stock_name,
                    "symbol": stock.symbol,
                    "quantity": stock.quantity,
                    "current_price": round(current_price, 2),
                    "stock_value": round(stock_value, 2)
                })

            return Response({
                "portfolio": portfolio,
                "total_investment": round(total_investment, 2)
            })
        except Exception as e:
            print("Error:", str(e))
            return Response({"error": str(e)}, status=500)

