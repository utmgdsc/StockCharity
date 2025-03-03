from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AccountViewSet

urlpatterns = [
    path("register/", AccountViewSet.as_view({"post": "create"}), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("account/", AccountViewSet.as_view({"get": "retrieve"}), name="account"),
    path(
        "increase-donations/",
        AccountViewSet.as_view({"patch": "increase_donations_total"}),
        name="increase_donation",
    ),
    path(
        "increase-dividends/",
        AccountViewSet.as_view({"patch": "increase_dividends_total"}),
        name="increase_dividends",
    ),
]
