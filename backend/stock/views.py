from rest_framework import viewsets
from .models import Stock
from .serializers import StockSerializer


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
