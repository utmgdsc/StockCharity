from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockViewSet 

router = DefaultRouter()
router.register(r'stock', StockViewSet, basename='stock') 

urlpatterns = [
    path('api/', include(router.urls)), 
    path('', include('stocks.urls'))
]