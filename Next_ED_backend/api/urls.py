# Next_ED_Backend/api/urls.py

from django.urls import path
from .views import RegisterView, LogoutView

urlpatterns = [
    # Custom Endpoints
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),

    # Add other API endpoints (courses, progress, etc.) here later
]
