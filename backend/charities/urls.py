from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

# define the router path and viewset to be used
router.register(r"charity", CharityViewSet, basename="charity")
urlpatterns = router.urls
