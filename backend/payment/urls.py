# products/urls.py
from django.urls import path
from .views import home, success, cancel


urlpatterns = [
    path("", home, name="home"),
    path("success/", success, name="success"),
    path("cancel/", cancel, name="cancel"),
]
