"""
Management command to set up Google OAuth2 SocialApp from .env credentials.
Usage: python manage.py setup_social_app
"""

from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from decouple import config


class Command(BaseCommand):
    help = 'Set up Google OAuth2 SocialApp from .env credentials'

    def handle(self, *args, **options):
        client_id = config('GOOGLE_CLIENT_ID')
        client_secret = config('GOOGLE_SECRET')

        # Ensure the default Site exists
        site, _ = Site.objects.get_or_create(
            id=1,
            defaults={'domain': 'localhost:8000', 'name': 'Next-Ed Dev'}
        )

        # Create or update the Google SocialApp
        app, created = SocialApp.objects.update_or_create(
            provider='google',
            defaults={
                'name': 'Google OAuth2',
                'client_id': client_id,
                'secret': client_secret,
            }
        )

        # Link the app to the site
        if not app.sites.filter(id=site.id).exists():
            app.sites.add(site)

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(
            f'{action} Google SocialApp (client_id: {client_id[:20]}...)'
        ))
