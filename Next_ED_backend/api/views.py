from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings as django_settings
from django.http import JsonResponse
import requests as http_requests

from .models import (
    CustomUser, Course, Lesson, StudentProgress,
    Note, Exercise, Exam, Correction,
    StudentQuestion, QuestionResponse,
    Quiz, Question, Choice
)
from .serializers import (
    UserSerializer, RegisterSerializer, CreateStaffSerializer,
    CourseSerializer, LessonSerializer, StudentProgressSerializer,
    NoteSerializer, ExerciseSerializer, ExamSerializer, CorrectionSerializer,
    StudentQuestionSerializer, QuestionResponseSerializer,
    QuizSerializer, ChangePasswordSerializer
)
from .permissions import IsAdmin, IsAdminOrDelegate, IsAdminOrDelegateForLevel
from .throttles import AuthRateThrottle


# --- User ViewSet ---
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=self.request.user.id)


# --- Auth Views ---
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send verification email
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            verify_url = f"{django_settings.FRONTEND_URL}/verify-email/{uid}/{token}"

            send_mail(
                subject='Next-Ed — Verify your email',
                message=f'Hi {user.first_name},\n\nPlease verify your email by clicking this link:\n{verify_url}\n\nThis link will expire in 24 hours.',
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f'Email send error: {e}')

        return Response(
            {'message': 'Registration successful. Please check your email to verify your account.'},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    """Activate a user account via email verification link."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Email verified successfully. You can now log in.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Verification link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """Send a password-reset email with a one-time link."""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        # Always return 200 to prevent user-enumeration attacks
        success_msg = {'message': 'If an account with that email exists, a password reset link has been sent.'}

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(success_msg, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{django_settings.FRONTEND_URL}/reset-password/{uid}/{token}"

        try:
            send_mail(
                subject='Next-Ed — Reset your password',
                message=(
                    f'Hi {user.first_name},\n\n'
                    f'Click the link below to reset your password:\n{reset_url}\n\n'
                    f'This link will expire in 24 hours.\n'
                    f'If you did not request this, simply ignore this email.'
                ),
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f'Password reset email error: {e}')

        return Response(success_msg, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """Validate the reset token and set a new password."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not all([uid, token, new_password, confirm_password]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate password against Django validators
        from django.contrib.auth.password_validation import validate_password
        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successfully. You can now log in.'}, status=status.HTTP_200_OK)


class GoogleLoginView(APIView):
    """Handle Google OAuth2 login via Google Identity Services id_token."""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({'error': 'Google credential is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the Google id_token
        try:
            google_response = http_requests.get(
                f'https://oauth2.googleapis.com/tokeninfo?id_token={credential}'
            )
            if google_response.status_code != 200:
                return Response({'error': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)

            google_data = google_response.json()

            # Verify the token is for our app
            if google_data.get('aud') != django_settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']:
                return Response({'error': 'Token not intended for this application.'}, status=status.HTTP_400_BAD_REQUEST)

            email = google_data.get('email')
            if not email:
                return Response({'error': 'Email not provided by Google.'}, status=status.HTTP_400_BAD_REQUEST)

            # Find or create user
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                # Auto-create as STUDENT
                user = CustomUser.objects.create_user(
                    email=email,
                    password=None,  # No password for Google users
                    first_name=google_data.get('given_name', ''),
                    last_name=google_data.get('family_name', ''),
                    role='STUDENT',
                    level=1,
                )
                user.is_active = True
                user.save()

            # Ensure user is active
            if not user.is_active:
                user.is_active = True
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Google login successful.',
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Google authentication failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class StatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return Response({
            'courses': Course.objects.count(),
            'students': CustomUser.objects.filter(role='STUDENT').count(),
            'delegates': CustomUser.objects.filter(role='DELEGATE').count(),
            'admins': CustomUser.objects.filter(role='ADMIN').count(),
            'pending_questions': StudentQuestion.objects.filter(status='PENDING').count(),
            'notes': Note.objects.count(),
            'exercises': Exercise.objects.count(),
            'exams': Exam.objects.count(),
        })


# ==========================================
# ADMIN USER MANAGEMENT (Admin-only)
# ==========================================
class AdminUserManagementViewSet(viewsets.ViewSet):
    """
    Admin-only endpoints:
    - list: All users with progress stats
    - create: Create Delegate or Admin accounts
    - destroy: Delete user accounts
    """
    permission_classes = [IsAdmin]

    def list(self, request):
        """List all users with progress stats (optimized — single annotated query)."""
        role_filter = request.query_params.get('role', None)
        queryset = CustomUser.objects.all().order_by('-date_joined')

        if role_filter:
            queryset = queryset.filter(role=role_filter)

        # Annotate student progress in a single query instead of 2N queries
        queryset = queryset.annotate(
            _completed_lessons=Count(
                'progress', filter=Q(progress__lesson__isnull=False, progress__completed=True)
            ),
            _completed_quizzes=Count(
                'progress', filter=Q(progress__quiz__isnull=False, progress__completed=True)
            ),
        )

        # Pre-compute totals once
        total_lessons = Lesson.objects.count()
        total_quizzes = Quiz.objects.count()
        total_items = total_lessons + total_quizzes

        users_data = []
        for user in queryset:
            user_data = UserSerializer(user).data

            if user.role == 'STUDENT':
                completed_items = user._completed_lessons + user._completed_quizzes
                progress_pct = round((completed_items / total_items * 100), 1) if total_items > 0 else 0.0
                user_data['progress'] = progress_pct
                user_data['completed_lessons'] = user._completed_lessons
                user_data['completed_quizzes'] = user._completed_quizzes
            else:
                user_data['progress'] = None

            users_data.append(user_data)

        return Response(users_data)

    def create(self, request):
        """Create a Delegate or Admin account."""
        serializer = CreateStaffSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        """Get detailed info for a single user including their progress."""
        try:
            user = CustomUser.objects.get(pk=pk)
            user_data = UserSerializer(user).data

            # Get completed progress items
            completed_progress = StudentProgress.objects.filter(
                student=user, completed=True
            ).select_related('lesson', 'lesson__course', 'quiz', 'quiz__course')

            completed_items = []
            for p in completed_progress:
                if p.lesson:
                    completed_items.append({
                        'type': 'lesson',
                        'title': p.lesson.title,
                        'course': p.lesson.course.title,
                        'completed_at': p.completed_at,
                    })
                elif p.quiz:
                    completed_items.append({
                        'type': 'quiz',
                        'title': p.quiz.title,
                        'course': p.quiz.course.title,
                        'score': p.score,
                        'completed_at': p.completed_at,
                    })

            user_data['completed_items'] = completed_items
            user_data['total_completed'] = len(completed_items)

            # Calculate overall progress
            total_lessons = Lesson.objects.count()
            total_quizzes = Quiz.objects.count()
            total_items = total_lessons + total_quizzes
            progress_pct = round((len(completed_items) / total_items * 100), 1) if total_items > 0 else 0.0
            user_data['progress'] = progress_pct

            return Response(user_data)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    def destroy(self, request, pk=None):
        """Delete a user account."""
        try:
            user = CustomUser.objects.get(pk=pk)
            if user == request.user:
                return Response(
                    {"error": "You cannot delete your own account."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )


# --- Course ViewSet (with Delegate level filtering) ---
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().select_related('created_by').prefetch_related('lessons', 'quizzes')
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrDelegateForLevel]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['level']
    search_fields = ['title', 'description', 'created_by__first_name', 'created_by__last_name']
    ordering_fields = ['level', 'title', 'created_at']

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Delegates can only create courses for their level
        if self.request.user.role == 'DELEGATE':
            serializer.save(created_by=self.request.user, level=self.request.user.level)
        else:
            serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def materials(self, request, pk=None):
        course = self.get_object()
        notes = Note.objects.filter(course=course).select_related('course', 'created_by')
        exercises = Exercise.objects.filter(course=course).select_related('course', 'created_by')
        exams = Exam.objects.filter(course=course).select_related('course', 'created_by').prefetch_related('correction')
        lessons = Lesson.objects.filter(course=course).select_related('course')
        
        return Response({
            'notes': NoteSerializer(notes, many=True, context={'request': request}).data,
            'exercises': ExerciseSerializer(exercises, many=True, context={'request': request}).data,
            'exams': ExamSerializer(exams, many=True, context={'request': request}).data,
            'lessons': LessonSerializer(lessons, many=True).data,
        })


# --- Lesson ViewSet ---
class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().select_related('course')
    serializer_class = LessonSerializer
    permission_classes = [IsAdminOrDelegateForLevel]


# --- Quiz ViewSet ---
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().prefetch_related('questions__choices')
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get('answers', {})
        
        if not answers:
            return Response({"error": "No answers provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Use prefetched questions+choices — 0 extra queries
        questions = list(quiz.questions.all())  # already prefetched
        total_questions = len(questions)
        if total_questions == 0:
             return Response({"error": "Quiz has no questions"}, status=status.HTTP_400_BAD_REQUEST)

        score = 0
        for question in questions:
            choice_id = answers.get(str(question.id))
            if choice_id:
                # Use prefetched choices — no DB hit
                for choice in question.choices.all():
                    if choice.id == int(choice_id) and choice.is_correct:
                        score += 1
                        break
        
        percentage = (score / total_questions) * 100
        
        StudentProgress.objects.update_or_create(
            student=request.user,
            quiz=quiz,
            defaults={
                'completed': True,
                'score': percentage,
                'completed_at': timezone.now()
            }
        )

        return Response({
            "score": score,
            "total": total_questions,
            "percentage": percentage
        })


# --- Leaderboard ViewSet ---
class LeaderboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        leaderboard = StudentProgress.objects.filter(completed=True).values(
            'student__id', 'student__email', 'student__first_name', 'student__last_name', 'student__avatar'
        ).annotate(
            total_score=Sum('score'),
            completed_count=Count('id')
        ).order_by('-total_score')[:10]

        return Response(leaderboard)


# --- Student Progress ViewSet ---
class StudentProgressViewSet(viewsets.ModelViewSet):
    serializer_class = StudentProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentProgress.objects.filter(
            student=self.request.user
        ).select_related('lesson', 'quiz')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# --- Resource ViewSets (with Delegate level-scoping) ---
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().select_related('course', 'created_by')
    serializer_class = NoteSerializer
    permission_classes = [IsAdminOrDelegateForLevel]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['level', 'course']
    search_fields = ['title', 'description', 'created_by__first_name', 'created_by__last_name']

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        if self.request.user.role == 'DELEGATE':
            serializer.save(created_by=self.request.user, level=self.request.user.level)
        else:
            serializer.save(created_by=self.request.user)

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all().select_related('course', 'created_by')
    serializer_class = ExerciseSerializer
    permission_classes = [IsAdminOrDelegateForLevel]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['level', 'course']
    search_fields = ['title', 'description', 'created_by__first_name', 'created_by__last_name']

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        if self.request.user.role == 'DELEGATE':
            serializer.save(created_by=self.request.user, level=self.request.user.level)
        else:
            serializer.save(created_by=self.request.user)

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().select_related('course', 'created_by').prefetch_related('correction')
    serializer_class = ExamSerializer
    permission_classes = [IsAdminOrDelegateForLevel]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'year', 'exam_type']

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        if self.request.user.role == 'DELEGATE':
            serializer.save(created_by=self.request.user, level=self.request.user.level)
        else:
            serializer.save(created_by=self.request.user)

class CorrectionViewSet(viewsets.ModelViewSet):
    queryset = Correction.objects.all().select_related('exam', 'created_by')
    serializer_class = CorrectionSerializer
    permission_classes = [IsAdminOrDelegateForLevel]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# --- Q&A ViewSets ---
class StudentQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = StudentQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base = StudentQuestion.objects.select_related(
            'student', 'course'
        ).prefetch_related('responses__admin')

        if user.role == 'ADMIN':
            queryset = base.all()
        elif user.role == 'DELEGATE':
            queryset = base.filter(target_level=user.level)
        else:
            queryset = base.filter(student=user)

        # Support ?status=PENDING / ?status=ANSWERED filtering
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def perform_create(self, serializer):
        # Auto-set target_level from user's level if not provided
        target_level = serializer.validated_data.get('target_level')
        if not target_level and self.request.user.level:
            serializer.save(student=self.request.user, target_level=self.request.user.level)
        else:
            serializer.save(student=self.request.user)

class QuestionResponseViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = QuestionResponse.objects.all().select_related('admin', 'question')
        question_id = self.request.query_params.get('question', None)
        if question_id:
            queryset = queryset.filter(question_id=question_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)
        
        question = serializer.validated_data['question']
        question.status = 'ANSWERED'
        question.save()


# --- Change Password View ---
class ChangePasswordView(APIView):
    """
    PUT /api/change-password/
    Verify old password, set new password, keep user logged in.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )
