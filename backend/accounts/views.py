from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import date

from .models import User
from .serializers import User_serializer

class Account_view_set(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = User_serializer

    @action(detail=False, methods=['post'], url_path='add-user')
    def add_user(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    @action(detail=False, methods=['patch', 'get'], url_path='change-staff-status')
    def change_staff_status(self, request):
        user_id = request.data.get('user_id')
        new_is_staff = request.data.get('is_staff')

        if user_id is None or new_is_staff is None:
            return Response({'error': 'user_id and is_staff are required fields.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        user.is_staff = new_is_staff
        user.save()

        return Response({'status': 'staff status updated successfully'}, status=200)
    

    @action(detail=False, methods=['patch', 'get'], url_path='change-active-status')
    def change_active_status(self, request):
        user_id = request.data.get('user_id')
        new_is_active = request.data.get('is_active')

        if user_id is None or new_is_active is None:
            return Response({'error': 'user_id and is_active are required fields.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        user.is_active = new_is_active
        user.save()

        return Response({'status': 'active status updated successfully'}, status=200)
    
    @action(detail=False, methods=['patch', 'get'], url_path='change-email')
    def change_email(self, request):
        user_id = request.data.get('user_id')
        new_email = request.data.get('email')

        if user_id is None or new_email is None:
            return Response({'error': 'user_id and email are required fields.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        user.email = new_email
        user.save()

        return Response({'status': 'email updated successfully'}, status=200)
    
    @action(detail=False, methods=['delete', 'get'], url_path='delete-user')
    def delete_user(self, request):
        user_id = request.data.get('user_id')

        if user_id is None:
            return Response({'error': 'user_id is a required field.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        user.delete()

        return Response({'status': 'user deleted successfully'}, status=200)