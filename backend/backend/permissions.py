from django.conf import settings

from rest_framework import permissions


class StaffOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            permissions.IsAdminUser().has_permission(request, view)
            or request.data.get("secret", None) == settings.SECRET_KEY
        )
