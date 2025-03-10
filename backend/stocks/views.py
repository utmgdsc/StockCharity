from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Stock
from .serializers import StockSerializer

class StockViewSet(viewsets.ModelViewSet):
    # Already include the following CRUD operations:
    # GET /stocks/<id>
    # GET /stocks
    # POST /stocks
    # DELETE /stocks/<id>
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    #TODO:
    # These are endpoints for stocks purchased by our organization
    # still need a way to update the model that aggregate all the stock values that we have 
    @action(detail=False, methods=['get'], url_path='total')
    def total(self, request):
        # Aggregate the total donation amount
        total_amount = self.get_queryset().aggregate(total=Sum('stock_amount'))['total'] or 0
        return Response({'total_donated_amount': total_amount})
