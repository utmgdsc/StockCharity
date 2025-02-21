from rest_framework import viewsets
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    # TODO: Add permission class later
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def retrieve(self, request):
        if request.auth is None:
            return Response(status=401)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)
