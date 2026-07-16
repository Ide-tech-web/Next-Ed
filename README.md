# Next-Ed Platform

Next-Ed is a modern educational platform designed for Computer Science students, featuring course management, quizzes, leaderboards, and a study hub.

## 🚀 Features

- **Course Management**: file uploads for lessons, notes, and exercises.
- **Quiz System**: Interactive quizzes with instant scoring.
- **Leaderboard**: Gamified progress tracking.
- **Study Hub**: Dashboard for student progress.
- **Glassmorphism UI**: Modern, aesthetic interface.

## 🛠️ Tech Stack

- **Backend**: Django 5, Django Rest Framework, SQLite, Cloudinary
- **Frontend**: React 18, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)

## 📦 Setup Instructions

### Backend

1.  Navigate to `Next_ED_backend`:
    ```bash
    cd Next_ED_backend
    ```
2.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up environment variables:
    - Copy `.env.example` to `.env`.
    - Fill in `CLOUDINARY_URL`, `SECRET_KEY`, etc.
5.  Run migrations:
    ```bash
    python manage.py migrate
    ```
6.  Start the server:
    ```bash
    python manage.py runserver
    ```

### Frontend

1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

## 📚 API Endpoints

- `POST /api/login/` - User Login
- `POST /api/register/` - User Registration
- `GET /api/courses/` - List Courses
- `GET /api/courses/{id}/` - Course Details
- `POST /api/quizzes/{id}/submit/` - Submit Quiz
- `GET /api/leaderboard/` - View Leaderboard

## 🧪 Testing

Run backend tests:

```bash
python manage.py test api
```
