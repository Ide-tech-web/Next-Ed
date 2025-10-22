from django.shortcuts import render

# Create your views here.

# Next_ED_Backend/api/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer
from .models import CustomUser # Import your custom model

# ----------------- 1. Registration View (POST /api/register/) -----------------
class RegisterView(generics.CreateAPIView):
    """
    Handles user registration. Creates a new CustomUser and hashes the password.
    """
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    # Allow anyone to access this view (they aren't logged in yet)
    permission_classes = () 
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Customize the response to be cleaner
        return Response(
            {"message": "User successfully created. You can now log in.", "user": serializer.data}, 
            status=status.HTTP_201_CREATED
        )

# ----------------- 2. Logout View (POST /api/logout/) -----------------
class LogoutView(APIView):
    """
    Blacklists the Refresh Token, effectively logging the user out immediately.
    """
    # Only authenticated users can access this view
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # The client must send the Refresh Token in the request body
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            
            # This is the key step: it invalidates the token
            token.blacklist()

            # HTTP 205 indicates the request has succeeded and the client should reset the document view
            return Response(status=status.HTTP_205_RESET_CONTENT)
            
        except KeyError:
            # Handle case where 'refresh_token' is missing from the request body
            return Response(
                {"detail": "Refresh token is required in the request body."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            # Handle cases where the token is already invalid or corrupted
            return Response(
                {"detail": "Token is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST
            )
