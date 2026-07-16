# Next_ED_Backend/api/management/commands/create_sample_data.py

from django.core.management.base import BaseCommand
from api.models import CustomUser, Course, Lesson, Note, Exercise, Exam, StudentQuestion
from django.core.files.base import ContentFile
from datetime import datetime

class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create admin user if doesn't exist
        admin, created = CustomUser.objects.get_or_create(
            email='admin@nexted.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin.email}'))

        # Create student user if doesn't exist
        student, created = CustomUser.objects.get_or_create(
            email='student@nexted.com',
            defaults={
                'first_name': 'Jean',
                'last_name': 'Dupont',
                'role': 'STUDENT',
            }
        )
        if created:
            student.set_password('student123')
            student.save()
            self.stdout.write(self.style.SUCCESS(f'Created student user: {student.email}'))

        # Create sample courses
        courses_data = [
            {
                'title': 'Introduction à Python',
                'description': 'Apprenez les bases de la programmation avec Python',
                'level': 1,
            },
            {
                'title': 'Structures de Données',
                'description': 'Arbres, graphes, listes chaînées et plus encore',
                'level': 2,
            },
            {
                'title': 'Algorithmique Avancée',
                'description': 'Algorithmes de tri, recherche et optimisation',
                'level': 2,
            },
            {
                'title': 'Intelligence Artificielle',
                'description': 'Machine Learning et Deep Learning',
                'level': 3,
            },
            {
                'title': 'Développement Web',
                'description': 'HTML, CSS, JavaScript et frameworks modernes',
                'level': 1,
            },
        ]

        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                defaults={
                    'description': course_data['description'],
                    'level': course_data['level'],
                    'created_by': admin,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created course: {course.title}'))

                # Create lessons for each course
                for i in range(1, 4):
                    Lesson.objects.get_or_create(
                        course=course,
                        title=f'Leçon {i}: {course.title}',
                        defaults={
                            'content': f'Contenu de la leçon {i} pour le cours {course.title}. '
                                     'Cette leçon couvre les concepts fondamentaux et les applications pratiques.',
                            'order': i,
                        }
                    )

        # Create a sample student question
        if Course.objects.exists():
            first_course = Course.objects.first()
            StudentQuestion.objects.get_or_create(
                student=student,
                course=first_course,
                defaults={
                    'question_text': 'Je ne comprends pas comment fonctionnent les boucles for en Python. '
                                    'Pouvez-vous m\'expliquer avec un exemple ?',
                    'status': 'PENDING',
                }
            )

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write('')
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin: admin@nexted.com / admin123')
        self.stdout.write('  Student: student@nexted.com / student123')
