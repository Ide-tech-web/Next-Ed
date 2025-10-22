# Next_ED_Backend/api/permissions.py

from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow users with the 'ADMIN' role to access.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the 'ADMIN' role
        return (request.user.is_authenticated and 
                request.user.role == 'ADMIN')

class IsStudentUser(permissions.BasePermission):
    """
    Custom permission to only allow users with the 'STUDENT' role to access.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the 'STUDENT' role
        return (request.user.is_authenticated and 
                request.user.role == 'STUDENT')

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow read-only access to all users, but write access 
    (POST, PUT, DELETE) only to users with the 'ADMIN' role.
    This is useful for course materials.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user.
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
            
        # Write permissions are only allowed to 'ADMIN' users.
        return (request.user.is_authenticated and 
                request.user.role == 'ADMIN')
