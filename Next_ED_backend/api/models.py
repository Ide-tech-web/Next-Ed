# Next_ED_Backend/api/models.py

from django.db import models
# Note the import of BaseUserManager
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings 


# ----------------- Custom User Manager (NEW) -----------------
class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier 
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'ADMIN') # Ensure admin role is set

        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


# ----------------- The CustomUser Model (UPDATED) -----------------
class CustomUser(AbstractUser):
    username = None # Remove username field
    email = models.EmailField(unique=True, null=False, blank=False)

    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] 
    
    # ASSIGN THE CUSTOM MANAGER
    objects = CustomUserManager() 

    def __str__(self):
        return self.email


# ----------------- Course Model (Existing) -----------------
class Course(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        limit_choices_to={'role': 'ADMIN'}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['title']


# ----------------- Lesson Model (Existing) -----------------
class Lesson(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='lessons'
    )
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    file_path = models.CharField(max_length=500, blank=True, null=True)
    order = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['course', 'order']


# ----------------- Student Progress Model (Existing) -----------------
class StudentProgress(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'STUDENT'}
    )
    
    lesson = models.ForeignKey(
        Lesson, 
        on_delete=models.CASCADE
    )
    
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.email} progress on {self.lesson.title}"
    
    class Meta:
        unique_together = ('student', 'lesson')
        verbose_name_plural = "Student Progress"
