from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockViewSet, StockPortfolioView

router = DefaultRouter()
router.register(r'stock', StockViewSet, basename='stock') 

urlpatterns = [
    path('api/', include(router.urls)), 
    path('api/portfolio/',  StockPortfolioView.as_view(), name='stock_portfolio'),
    ]