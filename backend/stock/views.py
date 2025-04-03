import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Stock, StockInfo
from .serializers import StockSerializer, StockInfoEntrySerializer



# Load environment variables
load_dotenv()

# Tiingo API Key
TIINGO_API_KEY = os.environ["TIINGO_API_KEY"]


def get_tiingo_stock_data(symbol: str):
    try:
        stock_info = StockInfo.objects.get(pk=symbol)
        # Check if we've updated this info within the last 24-hrs
    except StockInfo.DoesNotExist:
        # Create the info object
        stock_info = StockInfo(symbol=symbol)
        stock_info.save()
    if not stock_info.last_update or datetime.date(
        datetime.now()
    ) - stock_info.last_update > timedelta(days=1):
        # Get new data
        response = requests.get(
            f"http://api.tiingo.com/tiingo/daily/{symbol}/prices",
            headers={"Authorization": f"Token {TIINGO_API_KEY}"},
            params={
                "startDate": (
                    stock_info.last_update
                    or datetime.date(datetime.now() - timedelta(days=7))
                ).strftime("%Y-%m-%d"),
                "columns": ",".join(["date", "close", "divCash", "splitFactor"]),
            },
        )
        # If we don't get OK, raise an error
        if response.status_code != 200:
            raise Exception(response.text)

        # Deserialize the json information returned into some model
        serializer = StockInfoEntrySerializer(context={"stock":symbol}, data=response.json(), many=True)

        # Save the models created by the serializer
        if not serializer.is_valid():
            raise Exception(serializer.errors)
        serializer.save()

        # Save the last update time
        stock_info.last_update = datetime.date(datetime.now())
        stock_info.save()
    if stock_info.entries.count() == 0:
        return None
    return stock_info.entries.latest("date")


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class StockPortfolioView(APIView):
    """Fetches stock holdings and computes total investment"""

    def get(self, request):
        """Handles GET request to return portfolio information"""
        try:
            print("Fetching stock holdings from database...")
            stocks = Stock.objects.all()

            portfolio = []
            total_investment = 0

            for stock in stocks:
                info = get_tiingo_stock_data(stock.symbol)
                current_price = info.price if info else 0.0
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

