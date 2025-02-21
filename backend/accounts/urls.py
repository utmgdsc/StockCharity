from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AccountViewSet

urlpatterns = [
    path("register/", AccountViewSet.as_view({"post": "create"})),
    path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('account/', AccountViewSet.as_view({"get": "retrieve"}))
]
