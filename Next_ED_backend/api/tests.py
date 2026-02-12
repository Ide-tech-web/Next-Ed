
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
