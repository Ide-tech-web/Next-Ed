# Next_ED_Backend/api/permissions.py

from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Only allow ADMIN users."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'ADMIN'
        )


class IsAdminOrDelegate(permissions.BasePermission):
    """Allow ADMIN or DELEGATE users."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('ADMIN', 'DELEGATE')
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read for authenticated users, write only for ADMINs."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'ADMIN'
        )


class IsAdminOrDelegateForLevel(permissions.BasePermission):
    """
    Allow full access for ADMINs.
    Delegates can only create/edit/delete resources matching their assigned level.
    Read access is allowed for all authenticated users.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        # Read access for everyone authenticated
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write access for Admin (unrestricted) or Delegate
        return request.user.role in ('ADMIN', 'DELEGATE')

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.role == 'ADMIN':
            return True
        # Delegate can only modify resources of their level
        if request.user.role == 'DELEGATE':
            resource_level = getattr(obj, 'level', None)
            if resource_level is None and hasattr(obj, 'course'):
                resource_level = obj.course.level if obj.course else None
            return resource_level == request.user.level
        return False
