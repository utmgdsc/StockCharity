from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import date

from .models import User
from .serializers import UserSerializer

class AccountViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], url_path='add-user')
    def add_user(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    

    @action(detail=True, methods=['patch'], url_path='change-staff-status')
    def change_staff_status(self, request, pk=None):
        '''
        This method will change the staff_status of a given user
        
        Example cURL
        curl -X PATCH http://127.0.0.1:8000/accounts/1/change-staff-status/ -H "Content-Type: application/json" -d "{\"is_staff\": true}"'''
       
        user_id = pk
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

    @action(detail=True, methods=['patch'], url_path='change-active-status')
    def change_active_status(self, request, pk=None):
        '''
        This method sets the is_active status of a user to the given status (either true or false)

        Example cURL
        curl -X PATCH http://127.0.0.1:8000/accounts/1/change-staff-status/ -H "Content-Type: application/json" -d "{\"is_staff\": true}
        '''
        user_id = pk
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
    
    @action(detail=True, methods=['patch'], url_path='change-email')
    def change_email(self, request, pk=None):
        '''This method sets the email attached to a user to the given value
        
        Example cURL
        curl -X PATCH http://127.0.0.1:8000/accounts/1/change-email/ -H "Content-Type: application/json" -d "{\"email\": \"newemail@example.com\"}"
        '''
        user_id = pk
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
    
    @action(detail=True, methods=['delete'], url_path='delete-user')
    @action(detail=True, methods=['delete'], url_path='delete-user')
    def delete_user(self, request, pk=None):
        '''
        This method will delete the given user
        
        Example cURL
        curl -X DELETE http://127.0.0.1:8000/accounts/1/delete-user/ -H "Content-Type: application/json"
        '''
        user_id = pk

        if user_id is None:
            return Response({'error': 'user_id is a required field.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        user.delete()
        return Response({'status': 'user deleted successfully'}, status=200)

    @action(detail=False, methods=['get'], url_path='user-info')
    def get_user_information(self, request):
        '''This method returns a given user's information
        
        Example url
        http://127.0.0.1:8000/accounts/user-info/?user_id=2
        '''
        user_id = request.query_params.get('user_id')

        if user_id is None:
            return Response({'error': 'user_id is a required field.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

