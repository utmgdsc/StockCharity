from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AccountViewSet

urlpatterns = [
    path("register/", AccountViewSet.as_view({"post": "create"}), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("account/", AccountViewSet.as_view({"get": "retrieve"}), name="account"),
    path(
        "increase-donations/<int:pk>",
        AccountViewSet.as_view({"patch": "increase_donations_total"}),
        name="increase-donations",
    ),
    path(
        "increase-dividends/<int:pk>",
        AccountViewSet.as_view({"patch": "increase_dividends_total"}),
        name="increase-dividends",
    ),
]
