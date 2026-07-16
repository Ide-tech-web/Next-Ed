# Next_ED_Backend/api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Course, Lesson, StudentProgress,
    Note, Exercise, Exam, Correction,
    StudentQuestion, QuestionResponse
)


# ================= CUSTOM USER ADMIN =================
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Customized admin for CustomUser model"""
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'role', 'level', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'level', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Role & Level', {'fields': ('role', 'level')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'level', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )


# ================= COURSE ADMIN =================
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'created_by', 'created_at')
    list_filter = ('level', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('level', 'title')
    readonly_fields = ('created_at', 'updated_at')


# ================= LESSON ADMIN =================
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'file_path')
    list_filter = ('course',)
    search_fields = ('title', 'content')
    ordering = ('course', 'order')


# ================= NOTE ADMIN =================
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'level', 'created_by', 'created_at')
    list_filter = ('level', 'course', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


# ================= EXERCISE ADMIN =================
@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'level', 'created_by', 'created_at')
    list_filter = ('level', 'course', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


# ================= EXAM ADMIN =================
@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'level', 'year', 'created_by', 'created_at')
    list_filter = ('level', 'year', 'course', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-year', '-created_at')
    readonly_fields = ('created_at',)


# ================= CORRECTION ADMIN =================
@admin.register(Correction)
class CorrectionAdmin(admin.ModelAdmin):
    list_display = ('exam', 'created_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('exam__title', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


# ================= STUDENT PROGRESS ADMIN =================
@admin.register(StudentProgress)
class StudentProgressAdmin(admin.ModelAdmin):
    list_display = ('student', 'lesson', 'completed', 'completed_at')
    list_filter = ('completed', 'lesson__course')
    search_fields = ('student__email', 'lesson__title')
    ordering = ('-completed_at',)
    readonly_fields = ('completed_at',)


# ================= STUDENT QUESTION ADMIN =================
@admin.register(StudentQuestion)
class StudentQuestionAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'created_at')
    list_filter = ('status', 'course', 'created_at')
    search_fields = ('student__email', 'question_text')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


# ================= QUESTION RESPONSE ADMIN =================
@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    list_display = ('question', 'admin', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('question__question_text', 'response_text', 'admin__email')
    ordering = ('created_at',)
    readonly_fields = ('created_at',)
