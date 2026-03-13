"""
Custom throttle classes for Next-Ed API security.
"""
from rest_framework.throttling import SimpleRateThrottle


class AuthRateThrottle(SimpleRateThrottle):
    """
    Strict rate limit for authentication endpoints (login, register, password reset).
    Keyed by IP address to prevent brute-force attacks.
    Uses the 'auth' rate from REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'].
    """
    scope = 'auth'

    def get_cache_key(self, request, view):
        # Always throttle by IP, even for authenticated users
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request),
        }
