from django.shortcuts import render

# Create your views here.
from django.db.models import F, Sum, ExpressionWrapper, DecimalField
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import PurchasedStock
from .serializers import PurchasedStockSerializer

class PurchasedStockViewSet(viewsets.ModelViewSet):
    # Already include the following CRUD operations:
    # GET /stocks/<id>
    # GET /stocks
    # POST /stocks
    # DELETE /stocks/<id>
    queryset = PurchasedStock.objects.all()
    serializer_class = PurchasedStockSerializer

    #TODO:
    # These are endpoints for stocks purchased by our organization
    # still need a way to update the model that aggregate all the stock values that we have 
    @action(detail=False, methods=['get'], url_path='total')
    def total(self, request):
        # Aggregate the total donation amount
        total_value = self.get_queryset().aggregate(
            total=Sum(
                ExpressionWrapper(F('stock_amount') * F('stock_price'), output_field=DecimalField())
            )
        )['total'] or 0
        return Response({'total_purchased_amount': total_value})

    # Returns something like this
    # {
    #     "AAPL": "12345.67",
    #     "GOOG": "23456.78",
    #     "MSFT": "34567.89"
    # }
    @action(detail=False, methods=['get'], url_path='total_by_stock')
    def total_by_stock(self, request):
        # Group the stocks by symbol and compute the total value for each group
        aggregated = self.get_queryset().values('stock_symbol').annotate(
            total_value=Sum(
                ExpressionWrapper(F('stock_amount') * F('stock_price'), output_field=DecimalField())
            )
        )
        # Convert the queryset of dicts into a single dict keyed by stock symbol
        result = {entry['stock_symbol']: entry['total_value'] for entry in aggregated}
        return Response(result)