# Next_ED_Backend/api/serializers.py

from rest_framework import serializers
from .models import (
    CustomUser, Course, Lesson, StudentProgress,
    Note, Exercise, Exam, Correction,
    StudentQuestion, QuestionResponse,
    Quiz, Question, Choice
)

# --- User Serializers ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'level', 'date_joined', 'avatar')
        read_only_fields = ('id', 'email', 'role', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'level', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            level=validated_data.get('level', 1),
        )
        # Inactive until email is verified
        user.is_active = False
        user.save()
        return user

class CreateStaffSerializer(serializers.ModelSerializer):
    """Serializer for Admin to create Delegate or Admin accounts."""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'role', 'level', 'password')

    def validate_role(self, value):
        if value not in ('DELEGATE', 'ADMIN'):
            raise serializers.ValidationError("Role must be DELEGATE or ADMIN.")
        return value

    def validate(self, attrs):
        # Delegates must have a level
        if attrs.get('role') == 'DELEGATE' and not attrs.get('level'):
            raise serializers.ValidationError({"level": "Delegates must be assigned a level."})
        return attrs

    def create(self, validated_data):
        role = validated_data.get('role', 'DELEGATE')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role,
            level=validated_data.get('level', 1),
        )
        if role == 'ADMIN':
            user.is_staff = True
            user.save()
        return user

# --- Quiz System Serializers ---
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'questions', 'question_count']

# --- Lesson Serializer ---
class LessonSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = Lesson
        fields = '__all__'

# --- Student Progress Serializer ---
class StudentProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.ReadOnlyField(source='lesson.title')
    quiz_title = serializers.ReadOnlyField(source='quiz.title')
    
    class Meta:
        model = StudentProgress
        fields = ['id', 'student', 'lesson', 'lesson_title', 'quiz', 'quiz_title', 'completed', 'completed_at', 'score']
        read_only_fields = ['student', 'completed_at']

# --- Course Serializer ---
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'level', 'thumbnail', 'created_by', 'created_by_name', 'created_at', 'lessons', 'quizzes']
        read_only_fields = ('created_by', 'created_at')

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return None

# --- Resource Serializers ---
class NoteSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at')

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return None
    
    def get_file_url(self, obj):
        if obj.file:
            # Cloudinary URLs are already absolute HTTPS URLs
            return obj.file.url
        return None

class ExerciseSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at')

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return None
        
    def get_file_url(self, obj):
        if obj.file:
            # Cloudinary URLs are already absolute HTTPS URLs
            return obj.file.url
        return None

class CorrectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correction
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    correction = CorrectionSerializer(read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at')

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return None
        
    def get_file_url(self, obj):
        if obj.file:
            # Cloudinary URLs are already absolute HTTPS URLs
            return obj.file.url
        return None

# --- Q&A Serializers ---
class QuestionResponseSerializer(serializers.ModelSerializer):
    admin_email = serializers.ReadOnlyField(source='admin.email')

    class Meta:
        model = QuestionResponse
        fields = ['id', 'question', 'response_text', 'created_at', 'admin_email']
        read_only_fields = ('admin_email',)

class StudentQuestionSerializer(serializers.ModelSerializer):
    responses = QuestionResponseSerializer(many=True, read_only=True)
    student_email = serializers.ReadOnlyField(source='student.email')

    class Meta:
        model = StudentQuestion
        fields = ['id', 'student_email', 'course', 'question_text', 'status', 'created_at', 'responses']
