# Next-Ed - Complete Setup Guide

## System Requirements

- Python 3.8+
- Node.js 16+ and npm
- SQLite (included) or MySQL (optional)

## Installation

### 1. Install Node.js (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:

```bash
node --version
npm --version
```

### 2. Backend Setup

```bash
cd /home/evans/Desktop/Next-Ed/Next_ED_backend

# Install Python dependencies
pip3 install -r requirements.txt

# Run migrations
python3 manage.py migrate

# Create superuser (admin account)
python3 manage.py createsuperuser

# Start backend server
python3 manage.py runserver
```

Backend will run on: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

### 3. Frontend Setup

```bash
cd /home/evans/Desktop/Next-Ed/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: `http://localhost:3000`

## Quick Test

1. **Register a new student:**

   - Go to `http://localhost:3000/register`
   - Fill in the form and create account

2. **Login:**

   - Use your credentials to login
   - You'll be redirected to the student dashboard

3. **Create Admin User:**

   - Use Django admin panel to change a user's role to ADMIN
   - Or create superuser via command line

4. **Test Admin Features:**
   - Login as admin
   - Create courses
   - Upload materials
   - Answer student questions

## Features Overview

### Student Features

- ✅ User registration and authentication
- ✅ Browse courses by level
- ✅ View course materials (notes, exercises, exams)
- ✅ Ask questions to teachers
- ✅ View responses to questions
- ✅ Modern dark-mode UI

### Admin Features

- ✅ Create and manage courses
- ✅ Upload course materials (PDF, DOC, DOCX)
- ✅ View all student questions
- ✅ Respond to student questions
- ✅ Dashboard with statistics

## API Endpoints

All API endpoints are documented in:
`/home/evans/Desktop/Next-Ed/Next_ED_backend/API_DOCUMENTATION.md`

## Technology Stack

### Backend

- Django 3.2+
- Django REST Framework
- JWT Authentication
- SQLite/MySQL Database

### Frontend

- React 18
- React Router v6
- Axios for API calls
- Modern CSS with Glassmorphism

## Project Structure

```
Next-Ed/
├── Next_ED_backend/      # Django REST API
│   ├── api/              # Main app with models, views, serializers
│   ├── Next_ED_backend/  # Project settings
│   ├── media/            # Uploaded files
│   └── manage.py
│
└── frontend/             # React Application
    ├── public/           # Static files
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── context/      # Auth context
    │   ├── pages/        # All pages
    │   ├── utils/        # API utilities
    │   ├── App.js        # Main app with routing
    │   └── index.js      # Entry point
    └── package.json
```

## Troubleshooting

### Port already in use

```bash
# Kill process on port 8000
sudo lsof -t -i tcp:8000 | xargs kill -9

# Kill process on port 3000
sudo lsof -t -i tcp:3000 | xargs kill -9
```

### CORS Issues

Make sure CORS is properly configured in Django settings:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### npm install fails

Try:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend

1. Update `DEBUG = False` in settings.py
2. Set `ALLOWED_HOSTS`
3. Use PostgreSQL or MySQL
4. Configure static files serving
5. Use Gunicorn + Nginx

### Frontend

1. Build production bundle:
   ```bash
   npm run build
   ```
2. Serve the `build/` directory
3. Update API base URL in production

## Support

For issues or questions:

- Check API documentation
- Review Django error logs
- Check browser console for frontend errors
- Verify JWT tokens are being sent correctly
