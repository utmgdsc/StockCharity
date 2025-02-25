from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Donation
from .serializers import DonationSerializer

class DonationViewSet(viewsets.ModelViewSet):
    # Already include the following CRUD operations:
    # GET /donations/<id>
    # GET /donations
    # POST /donations
    # DELETE /donations/<id>
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

    #TODO:
    # There's no auth checking atm 

    @action(detail=False, methods=['get'], url_path='total')
    def total(self, request):
        # Aggregate the total donation amount
        total_amount = self.get_queryset().aggregate(total=Sum('amount'))['total'] or 0
        return Response({'total_donated_amount': total_amount})