# Next_ED_Backend/api/models.py

from django.db import models
# Note the import of BaseUserManager
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.utils import timezone 
from cloudinary_storage.storage import MediaCloudinaryStorage, RawMediaCloudinaryStorage


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
        ('DELEGATE', 'Delegate'),
        ('ADMIN', 'Admin'),
    )
    LEVEL_CHOICES = (
        (1, 'Level 1'),
        (2, 'Level 2'),
        (3, 'Level 3'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1, null=True, blank=True)
    
    # New Cloudinary Avatar Field
    avatar = models.ImageField(upload_to='avatars/', storage=MediaCloudinaryStorage(), blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] 
    
    # ASSIGN THE CUSTOM MANAGER
    objects = CustomUserManager() 

    def __str__(self):
        return self.email


# ----------------- Course Model (UPDATED) -----------------
class Course(models.Model):
    LEVEL_CHOICES = (
        (1, 'Level 1'),
        (2, 'Level 2'),
        (3, 'Level 3'),
    )
    
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    
    # New Cloudinary Thumbnail Field
    thumbnail = models.ImageField(upload_to='course_thumbnails/', storage=MediaCloudinaryStorage(), blank=True, null=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (Level {self.level})"
    
    class Meta:
        ordering = ['level', 'title']


# ----------------- Lesson Model (Existing) -----------------
class Lesson(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='lessons'
    )
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    # Implicitly uses DEFAULT_FILE_STORAGE (RawMediaCloudinaryStorage)
    file_path = models.FileField(upload_to='lessons/', blank=True, null=True)
    order = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['course', 'order']


# ----------------- Quiz System Models (NEW) -----------------
class Quiz(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='quizzes'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz, 
        on_delete=models.CASCADE, 
        related_name='questions'
    )
    text = models.TextField()
    
    def __str__(self):
        return f"Question for {self.quiz.title}"

class Choice(models.Model):
    question = models.ForeignKey(
        Question, 
        on_delete=models.CASCADE, 
        related_name='choices'
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


# ----------------- Student Progress Model (UPDATED) -----------------
class StudentProgress(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'STUDENT'},
        related_name='progress'
    )
    
    # Progress can be linked to a Lesson OR a Quiz
    lesson = models.ForeignKey(
        Lesson, 
        on_delete=models.CASCADE,
        null=True, blank=True
    )
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        null=True, blank=True
    )
    
    # General status
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Quiz specific
    score = models.FloatField(default=0.0) # Percentage or points

    def __str__(self):
        if self.lesson:
            return f"{self.student.email} - Lesson: {self.lesson.title}"
        elif self.quiz:
            return f"{self.student.email} - Quiz: {self.quiz.title} ({self.score}%)"
        return f"{self.student.email} - Unknown Progress"
    
    class Meta:
        # Enforce unique progress record per student per item type
        constraints = [
            models.UniqueConstraint(fields=['student', 'lesson'], name='unique_lesson_progress', condition=models.Q(lesson__isnull=False)),
            models.UniqueConstraint(fields=['student', 'quiz'], name='unique_quiz_progress', condition=models.Q(quiz__isnull=False))
        ]
        verbose_name_plural = "Student Progress"


# ----------------- Note Model -----------------
class Note(models.Model):
    """
    Course notes and study materials uploaded by admins
    """
    LEVEL_CHOICES = (
        (1, 'Level 1'),
        (2, 'Level 2'),
        (3, 'Level 3'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Implicitly uses DEFAULT_FILE_STORAGE (RawMediaCloudinaryStorage)
    file = models.FileField(upload_to='notes/')
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.course.title}"
    
    class Meta:
        ordering = ['-created_at']


# ----------------- Exercise Model -----------------
class Exercise(models.Model):
    """
    Practice exercises and TDs for students
    """
    LEVEL_CHOICES = (
        (1, 'Level 1'),
        (2, 'Level 2'),
        (3, 'Level 3'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Implicitly uses DEFAULT_FILE_STORAGE (RawMediaCloudinaryStorage)
    file = models.FileField(upload_to='exercises/')
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='exercises'
    )
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.course.title}"
    
    class Meta:
        ordering = ['-created_at']


# ----------------- Exam Model -----------------
class Exam(models.Model):
    """
    Past exams for students to practice
    """
    LEVEL_CHOICES = (
        (1, 'Level 1'),
        (2, 'Level 2'),
        (3, 'Level 3'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Implicitly uses DEFAULT_FILE_STORAGE (RawMediaCloudinaryStorage)
    file = models.FileField(upload_to='exams/')
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='exams'
    )
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    
    EXAM_TYPE_CHOICES = (
        ('CC', 'Contrôle Continu'),
        ('SN', 'Session Normale'),
        ('SR', 'Session Rattrapage'),
    )
    exam_type = models.CharField(max_length=2, choices=EXAM_TYPE_CHOICES, default='SN')
    
    year = models.IntegerField(null=True, blank=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        year_str = f" ({self.year})" if self.year else ""
        return f"{self.title}{year_str} - {self.course.title}"
    
    class Meta:
        ordering = ['-year', '-created_at']


# ----------------- Correction Model -----------------
class Correction(models.Model):
    """
    Solutions and corrections for exams
    """
    exam = models.OneToOneField(
        Exam,
        on_delete=models.CASCADE,
        related_name='correction'
    )
    description = models.TextField(blank=True)
    # Implicitly uses DEFAULT_FILE_STORAGE (RawMediaCloudinaryStorage)
    file = models.FileField(upload_to='corrections/')
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Correction for {self.exam.title}"
    
    class Meta:
        ordering = ['-created_at']


# ----------------- Student Question Model -----------------
class StudentQuestion(models.Model):
    """
    Questions and clarification requests from students to admins
    """
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ANSWERED', 'Answered'),
    )
    LEVEL_CHOICES = (
        (1, 'Level 1'),
        (2, 'Level 2'),
        (3, 'Level 3'),
    )
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='questions',
        null=True,
        blank=True
    )
    question_text = models.TextField()
    target_level = models.IntegerField(
        choices=LEVEL_CHOICES,
        null=True,
        blank=True,
        help_text='Level this question is targeted at'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Question from {self.student.email} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']


# ----------------- Question Response Model -----------------
class QuestionResponse(models.Model):
    """
    Admin/Delegate responses to student questions
    """
    question = models.ForeignKey(
        StudentQuestion,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='answered_questions'
    )
    response_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def answered_by_name(self):
        if self.admin:
            return f"{self.admin.first_name} {self.admin.last_name}".strip() or self.admin.email
        return 'Unknown'

    @property
    def answered_by_role(self):
        if self.admin:
            return self.admin.role
        return 'Unknown'
    
    def __str__(self):
        return f"Response by {self.admin.email if self.admin else 'Unknown'}"
    
    class Meta:
        ordering = ['created_at']
