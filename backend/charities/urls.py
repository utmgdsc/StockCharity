from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r"charity", CharityViewSet, basename="charity")
urlpatterns = [
    path('', include(router.urls)),
    path(
        "total-charities/",
        CharityViewSet.as_view({"get": "get_total_charities"}),
        name="total-charities",
    ),
]