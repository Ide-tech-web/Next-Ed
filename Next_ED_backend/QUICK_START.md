# Next-Ed Backend - Quick Start Guide

## Prerequisites

- Python 3.8 or higher
- MySQL Server (optional, SQLite configured by default)
- pip (Python package manager)

## Installation Steps

### 1. Install Dependencies

```bash
cd /home/evans/Desktop/Next-Ed/Next_ED_backend
pip3 install -r requirements.txt
```

### 2. Run Migrations

```bash
python3 manage.py migrate
```

### 3. Create Superuser (Admin)

```bash
python3 manage.py createsuperuser
# Enter email, first name, last name, and password
```

### 4. Start Development Server

```bash
python3 manage.py runserver
```

The server will start at `http://localhost:8000/`

## Quick Testing

### Option 1: Use the Test Script

```bash
cd /home/evans/Desktop/Next-Ed/Next_ED_backend
./test_api.sh
```

### Option 2: Manual Testing with cURL

**Register a user:**

```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@school.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "test123",
    "password2": "test123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@school.com",
    "password": "test123"
  }'
```

**Get profile (use token from login):**

```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Admin Panel

Access the admin panel at: `http://localhost:8000/admin/`

From here you can:

- Manage users (change roles to ADMIN)
- Create courses
- Upload notes, exercises, and exams
- View student progress
- Respond to student questions

## API Documentation

Full API documentation available at:
`/home/evans/Desktop/Next-Ed/Next_ED_backend/API_DOCUMENTATION.md`

## Directory Structure

```
Next_ED_backend/
├── api/                    # Main API application
│   ├── models.py          # Database models
│   ├── serializers.py     # DRF serializers
│   ├── views.py           # API views
│   ├── urls.py            # API URL routing
│   ├── admin.py           # Admin panel config
│   └── permissions.py     # Custom permissions
├── Next_ED_backend/       # Project settings
│   ├── settings.py        # Django settings
│   └── urls.py            # Main URL config
├── media/                 # Uploaded files (created automatically)
│   ├── notes/
│   ├── exercises/
│   ├── exams/
│   └── corrections/
├── requirements.txt       # Python dependencies
├── API_DOCUMENTATION.md   # API reference
└── test_api.sh           # Testing script
```

## Switching to MySQL

1. Install MySQL:

```bash
sudo apt install mysql-server
pip3 install mysqlclient
```

2. Create database:

```bash
mysql -u root -p
CREATE DATABASE next_ed_db;
```

3. Update `settings.py`:

   - Uncomment MySQL configuration (lines 85-97)
   - Comment out SQLite configuration (lines 100-104)
   - Update credentials (user, password)

4. Run migrations:

```bash
python3 manage.py migrate
```

## Common Tasks

### Create a Course (via Admin Panel)

1. Login to admin panel
2. Go to "Courses" → "Add Course"
3. Fill in title, description, level
4. Save

### Upload Course Materials (via API)

```bash
curl -X POST http://localhost:8000/api/notes/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "title=Week 1 Notes" \
  -F "description=Introduction to programming" \
  -F "course=1" \
  -F "level=1" \
  -F "file=@notes.pdf"
```

### Change User Role to Admin

1. Login to admin panel
2. Go to "Custom Users"
3. Click on the user
4. Change "Role" from "STUDENT" to "ADMIN"
5. Save

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000
sudo lsof -t -i tcp:8000 | xargs kill -9
```

### Database Locked (SQLite)

```bash
# Stop all Django processes
pkill -f runserver
# Restart server
python3 manage.py runserver
```

### Missing Dependencies

```bash
pip3 install -r requirements.txt --upgrade
```

## Next Steps

1. ✅ Backend is complete and tested
2. Connect your React frontend to these endpoints
3. Test file upload/download functionality
4. Deploy to production server
5. Set up proper file storage (AWS S3) for production

## Support

For issues or questions:

- Check API_DOCUMENTATION.md for endpoint details
- Review Django error logs in the terminal
- Check browser console for CORS issues
- Verify JWT tokens are being sent correctly
