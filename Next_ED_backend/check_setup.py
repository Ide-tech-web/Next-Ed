
import os
import sys
import django
from django.conf import settings
from django.core.files.base import ContentFile

# Configure Django settings BEFORE importing anything that uses them
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Next_ED_backend.settings')
django.setup()

from cloudinary_storage.storage import MediaCloudinaryStorage, RawMediaCloudinaryStorage

def check_setup():
    print("Checking setup...")
    
    # 1. Check .env loading
    try:
        from decouple import config
        secret_key = config('SECRET_KEY')
        print(f"✅ SECRET_KEY loaded: {secret_key[:5]}...")
    except Exception as e:
        print(f"❌ Failed to load SECRET_KEY from .env: {e}")
        return

    # 2. Check Database Engine
    db_engine = settings.DATABASES['default']['ENGINE']
    if db_engine == 'django.db.backends.sqlite3':
        print("✅ Database engine is SQLite3")
    else:
        print(f"❌ Database engine is NOT SQLite3: {db_engine}")

    # 3. Test Cloudinary Upload (Raw)
    try:
        raw_storage = RawMediaCloudinaryStorage()
        file_name = 'test_upload.txt'
        content = ContentFile(b'Hello Cloudinary!')
        saved_name = raw_storage.save(file_name, content)
        url = raw_storage.url(saved_name)
        print(f"✅ Raw file uploaded successfully: {url}")
    except Exception as e:
        print(f"❌ Failed to upload raw file: {e}")

    # 4. Test Cloudinary Upload (Image) - Optional, requires valid image data
    # For now, we'll verify the storage class is configured
    try:
        media_storage = MediaCloudinaryStorage()
        print("✅ MediaCloudinaryStorage initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize MediaCloudinaryStorage: {e}")

if __name__ == "__main__":
    check_setup()
