from rest_framework import routers
from django.urls import path
from .views import *

router = routers.DefaultRouter()

router.register(r"charity", CharityViewSet, basename="charity")
urlpatterns = router.urls
