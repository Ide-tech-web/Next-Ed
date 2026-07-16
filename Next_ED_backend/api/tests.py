
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import CustomUser, Course, Quiz, Question, Choice, StudentProgress

class QuizTests(APITestCase):
    def setUp(self):
        # Create Users
        self.student = CustomUser.objects.create_user(email='student@example.com', password='password123', role='STUDENT')
        self.admin = CustomUser.objects.create_user(email='admin@example.com', password='password123', role='ADMIN')
        
        # Create Course & Quiz
        self.course = Course.objects.create(title="Test Course", description="Desc", level=1, created_by=self.admin)
        self.quiz = Quiz.objects.create(title="Test Quiz", description="Quiz Desc", course=self.course)
        
        # Create Question & Choices
        self.question = Question.objects.create(quiz=self.quiz, text="What is 2+2?")
        self.choice1 = Choice.objects.create(question=self.question, text="4", is_correct=True)
        self.choice2 = Choice.objects.create(question=self.question, text="5", is_correct=False)

        # Authenticate as Student
        self.client.force_authenticate(user=self.student)

    def test_get_quizzes(self):
        url = reverse('quiz-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_submit_quiz_correct(self):
        url = reverse('quiz-submit', args=[self.quiz.id])
        data = {
            "answers": {
                str(self.question.id): self.choice1.id
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 1)
        self.assertEqual(response.data['percentage'], 100.0)
        
        # Check Progress
        progress = StudentProgress.objects.get(student=self.student, quiz=self.quiz)
        self.assertTrue(progress.completed)
        self.assertEqual(progress.score, 100.0)

    def test_submit_quiz_incorrect(self):
        url = reverse('quiz-submit', args=[self.quiz.id])
        data = {
            "answers": {
                str(self.question.id): self.choice2.id
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 0)
        self.assertEqual(response.data['percentage'], 0.0)


class LeaderboardTests(APITestCase):
    def setUp(self):
        self.student1 = CustomUser.objects.create_user(email='s1@example.com', password='password123', first_name='Alice', role='STUDENT')
        self.student2 = CustomUser.objects.create_user(email='s2@example.com', password='password123', first_name='Bob', role='STUDENT')
        self.client.force_authenticate(user=self.student1)

        # Create Progress
        course = Course.objects.create(title="Course", level=1, created_by=self.student1) # creator doesn't matter here
        quiz = Quiz.objects.create(title="Quiz", course=course)
        
        StudentProgress.objects.create(student=self.student1, quiz=quiz, completed=True, score=100)
        StudentProgress.objects.create(student=self.student2, quiz=quiz, completed=True, score=80)

    def test_leaderboard(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Alice should be first
        self.assertEqual(response.data[0]['student__first_name'], 'Alice')
        self.assertEqual(response.data[0]['total_score'], 100)
        
        # Bob should be second
        self.assertEqual(response.data[1]['student__first_name'], 'Bob')
        self.assertEqual(response.data[1]['total_score'], 80)


class SearchFilterTests(APITestCase):
    """Verify that the backend search_fields work on CourseViewSet."""

    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email='admin@search.com', password='pass1234',
            first_name='Alice', last_name='Smith', role='ADMIN',
        )
        self.client.force_authenticate(user=self.admin)

        Course.objects.create(title='Python Basics', description='Learn Python', level=1, created_by=self.admin)
        Course.objects.create(title='Java Advanced', description='Master Java', level=2, created_by=self.admin)
        Course.objects.create(title='Data Structures', description='Python collections', level=1, created_by=self.admin)

    def test_search_by_title(self):
        url = reverse('course-list') + '?search=Python'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [c['title'] for c in response.data]
        self.assertIn('Python Basics', titles)
        self.assertNotIn('Java Advanced', titles)

    def test_search_by_description(self):
        url = reverse('course-list') + '?search=collections'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Data Structures')

    def test_search_by_author_name(self):
        url = reverse('course-list') + '?search=Alice'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # All 3 courses are by Alice
        self.assertEqual(len(response.data), 3)


class SignalEmailTests(APITestCase):
    """Verify the post_save signal on QuestionResponse sends an email."""

    def setUp(self):
        from .models import StudentQuestion
        self.student = CustomUser.objects.create_user(
            email='student@signal.com', password='pass1234',
            first_name='Bob', role='STUDENT',
        )
        self.admin = CustomUser.objects.create_user(
            email='admin@signal.com', password='pass1234',
            first_name='Prof', last_name='X', role='ADMIN',
        )
        self.course = Course.objects.create(
            title='Signal Course', description='Testing signals', level=1,
            created_by=self.admin,
        )
        self.question = StudentQuestion.objects.create(
            student=self.student,
            course=self.course,
            question_text='How do signals work?',
            target_level=1,
        )

    @patch('api.signals.send_mail')
    def test_signal_sends_email_on_new_answer(self, mock_send):
        """Creating a QuestionResponse should trigger the signal and call send_mail."""
        from .models import QuestionResponse
        QuestionResponse.objects.create(
            question=self.question,
            admin=self.admin,
            response_text='Signals are Django event hooks.',
        )
        mock_send.assert_called_once()
        call_kwargs = mock_send.call_args
        # Verify recipient is the student who asked
        self.assertIn(self.student.email, call_kwargs[1]['recipient_list'])
        # Verify HTML message is present
        self.assertIn('html_message', call_kwargs[1])

    @patch('api.signals.send_mail', side_effect=Exception('SMTP down'))
    def test_signal_handles_email_failure_gracefully(self, mock_send):
        """If send_mail raises, the QuestionResponse should still be saved."""
        from .models import QuestionResponse
        qr = QuestionResponse.objects.create(
            question=self.question,
            admin=self.admin,
            response_text='This should still save.',
        )
        self.assertIsNotNone(qr.pk)
        mock_send.assert_called_once()

