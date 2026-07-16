# Next_ED_Backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView, LogoutView, UserProfileView, StatsView,
    VerifyEmailView, GoogleLoginView,
    PasswordResetRequestView, PasswordResetConfirmView,
    ChangePasswordView,
    UserViewSet, CourseViewSet, LessonViewSet, StudentProgressViewSet,
    NoteViewSet, ExerciseViewSet, ExamViewSet, CorrectionViewSet,
    StudentQuestionViewSet, QuestionResponseViewSet,
    QuizViewSet, LeaderboardViewSet,
    AdminUserManagementViewSet
)
from .throttles import AuthRateThrottle

# Initialize the router
router = DefaultRouter()

# Register ViewSets
router.register(r'users', UserViewSet, basename='user')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'progress', StudentProgressViewSet, basename='progress')

# Educational Materials
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'corrections', CorrectionViewSet, basename='correction')

# Q&A System
router.register(r'questions', StudentQuestionViewSet, basename='student-question')
router.register(r'responses', QuestionResponseViewSet, basename='question-response')

# Quiz System & Leaderboard
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')

# Admin Management
router.register(r'admin-management', AdminUserManagementViewSet, basename='admin-management')

# Throttled JWT login view
class ThrottledTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [AuthRateThrottle]

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Auth Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', ThrottledTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Google OAuth2
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    
    # Email Verification
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    
    # Password Reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Dashboard Stats
    path('stats/', StatsView.as_view(), name='dashboard-stats'),

    # Change Password
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
