# Next-Ed Backend API Documentation

## Base URL

```
http://localhost:8000/api/
```

## Authentication

### Register a New User

**Endpoint:** `POST /api/register/`  
**Permission:** Public  
**Request Body:**

```json
{
  "email": "student@school.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securePassword123",
  "password2": "securePassword123"
}
```

**Response:** `201 CREATED`

```json
{
  "message": "User successfully created. You can now log in.",
  "user": {
    "email": "student@school.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Login (Get JWT Tokens)

**Endpoint:** `POST /api/token/`  
**Permission:** Public  
**Request Body:**

```json
{
  "email": "student@school.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Access Token

**Endpoint:** `POST /api/token/refresh/`  
**Request Body:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Logout

**Endpoint:** `POST /api/logout/`  
**Authentication:** Required (Bearer Token)  
**Request Body:**

```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get User Profile

**Endpoint:** `GET /api/users/profile/`  
**Authentication:** Required

---

## Courses

### List All Courses

**Endpoint:** `GET /api/courses/`  
**Authentication:** Required  
**Query Parameters:**

- `level` (optional): Filter by level (1, 2, or 3)

### Create Course (Admin Only)

**Endpoint:** `POST /api/courses/`  
**Authentication:** Required (Admin)  
**Request Body:**

```json
{
  "title": "Introduction to Programming",
  "description": "Learn the basics of programming",
  "level": 1
}
```

### Get Course Details

**Endpoint:** `GET /api/courses/{id}/`

### Get All Materials for a Course

**Endpoint:** `GET /api/courses/{id}/materials/`  
Returns all notes, exercises, exams, and lessons for the course.

### Update Course (Admin Only)

**Endpoint:** `PUT/PATCH /api/courses/{id}/`

### Delete Course (Admin Only)

**Endpoint:** `DELETE /api/courses/{id}/`

---

## Notes

### List Notes

**Endpoint:** `GET /api/notes/`  
**Query Parameters:**

- `course` (optional): Filter by course ID
- `level` (optional): Filter by level

### Upload Note (Admin Only - Multipart Form Data)

**Endpoint:** `POST /api/notes/`  
**Authentication:** Required (Admin)  
**Content-Type:** `multipart/form-data`  
**Form Fields:**

- `title`: Note title
- `description`: Note description
- `file`: PDF/document file
- `course`: Course ID
- `level`: Academic level (1, 2, or 3)

**cURL Example:**

```bash
curl -X POST http://localhost:8000/api/notes/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=Week 1 Lecture Notes" \
  -F "description=Introduction to variables" \
  -F "course=1" \
  -F "level=1" \
  -F "file=@/path/to/notes.pdf"
```

### Get Note Details

**Endpoint:** `GET /api/notes/{id}/`

### Update Note (Admin Only)

**Endpoint:** `PUT/PATCH /api/notes/{id}/`

### Delete Note (Admin Only)

**Endpoint:** `DELETE /api/notes/{id}/`

---

## Exercises

### List Exercises

**Endpoint:** `GET /api/exercises/`  
**Query Parameters:**

- `course` (optional)
- `level` (optional)

### Upload Exercise (Admin Only - Multipart Form Data)

**Endpoint:** `POST /api/exercises/`  
**Form Fields:**

- `title`: Exercise title
- `description`: Exercise description
- `file`: PDF/document file
- `course`: Course ID
- `level`: Academic level

### Get Exercise Details

**Endpoint:** `GET /api/exercises/{id}/`

### Update Exercise (Admin Only)

**Endpoint:** `PUT/PATCH /api/exercises/{id}/`

### Delete Exercise (Admin Only)

**Endpoint:** `DELETE /api/exercises/{id}/`

---

## Exams

### List Exams

**Endpoint:** `GET /api/exams/`  
**Query Parameters:**

- `course` (optional)
- `level` (optional)
- `year` (optional): Filter by exam year

### Upload Exam (Admin Only - Multipart Form Data)

**Endpoint:** `POST /api/exams/`  
**Form Fields:**

- `title`: Exam title
- `description`: Exam description
- `file`: PDF/document file
- `course`: Course ID
- `level`: Academic level
- `year`: Exam year (optional)

### Get Exam Details

**Endpoint:** `GET /api/exams/{id}/`

---

## Corrections

### List Corrections

**Endpoint:** `GET /api/corrections/`

### Upload Correction (Admin Only - Multipart Form Data)

**Endpoint:** `POST /api/corrections/`  
**Form Fields:**

- `exam`: Exam ID
- `description`: Correction description
- `file`: PDF/document file

---

## Lessons

### List Lessons

**Endpoint:** `GET /api/lessons/`  
**Query Parameters:**

- `course` (optional): Filter by course ID

### Create Lesson (Admin Only)

**Endpoint:** `POST /api/lessons/`  
**Request Body:**

```json
{
  "course": 1,
  "title": "Variables and Data Types",
  "content": "Lesson content here...",
  "file_path": "optional/path/to/file",
  "order": 1
}
```

---

## Student Progress

### Get My Progress (Student)

**Endpoint:** `GET /api/progress/`  
Students see only their own progress. Admins see all.

**Query Parameters (Admin only):**

- `student` (optional): Filter by student ID
- `lesson` (optional): Filter by lesson ID

### Mark Lesson as Complete

**Endpoint:** `POST /api/progress/`  
**Request Body:**

```json
{
  "lesson": 1,
  "completed": true
}
```

### Update Progress

**Endpoint:** `PATCH /api/progress/{id}/`  
**Request Body:**

```json
{
  "completed": true
}
```

---

## Student Questions

### List My Questions (Student) / All Questions (Admin)

**Endpoint:** `GET /api/questions/`  
**Query Parameters (Admin only):**

- `status` (optional): Filter by PENDING or ANSWERED

### Submit a Question

**Endpoint:** `POST /api/questions/`  
**Request Body:**

```json
{
  "course": 1,
  "question_text": "I don't understand recursion. Can you help?"
}
```

### Get Question Details

**Endpoint:** `GET /api/questions/{id}/`

---

## Admin Responses to Questions

### List Responses

**Endpoint:** `GET /api/responses/`  
**Query Parameters:**

- `question` (optional): Filter by question ID

### Post a Response (Admin Only)

**Endpoint:** `POST /api/responses/`  
**Request Body:**

```json
{
  "question": 1,
  "response_text": "Recursion is when a function calls itself..."
}
```

_Note: Posting a response automatically marks the question as ANSWERED._

---

## Authentication Header Format

For all authenticated requests, include the JWT token in the header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Error message here"
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

---

## Testing with cURL Examples

### 1. Register a User

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

### 2. Login

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@school.com",
    "password": "test123"
  }'
```

### 3. Get User Profile

```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Create a Course (Admin)

```bash
curl -X POST http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Programming",
    "description": "Learn Python from scratch",
    "level": 1
  }'
```

### 5. Upload a Note (Admin)

```bash
curl -X POST http://localhost:8000/api/notes/ \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -F "title=Introduction to Python" \
  -F "description=Basic Python concepts" \
  -F "course=1" \
  -F "level=1" \
  -F "file=@notes.pdf"
```

---

## Admin Panel Access

Access the Django admin panel at: `http://localhost:8000/admin/`

Create a superuser with:

```bash
python manage.py createsuperuser
```

From the admin panel, administrators can:

- Manage all users
- Upload and manage course materials
- View student progress
- Respond to student questions
- Monitor all system activities
