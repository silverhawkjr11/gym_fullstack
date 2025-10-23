from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from datetime import datetime, timedelta
from .models import Student, Lesson, Payment

User = get_user_model()


class StudentModelTest(TestCase):
    """Test the Student model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='trainee1',
            password='pass123',
            role='TRAINEE'
        )

    def test_create_student(self):
        """Test creating a student profile"""
        student = Student.objects.create(
            user=self.user,
            phone='1234567890',
            notes='Test notes'
        )
        self.assertEqual(student.user, self.user)
        self.assertEqual(student.phone, '1234567890')
        self.assertEqual(str(student), 'trainee1')


class LessonModelTest(TestCase):
    """Test the Lesson model"""

    def setUp(self):
        self.trainer = User.objects.create_user(
            username='trainer1',
            password='pass123',
            role='TRAINER'
        )
        self.trainee = User.objects.create_user(
            username='trainee1',
            password='pass123',
            role='TRAINEE',
            trainer=self.trainer
        )
        self.student = Student.objects.create(user=self.trainee)

    def test_create_lesson(self):
        """Test creating a lesson"""
        start_time = datetime.now()
        end_time = start_time + timedelta(hours=1)
        lesson = Lesson.objects.create(
            trainer=self.trainer,
            student=self.student,
            start=start_time,
            end=end_time,
            location='Gym A',
            price_ils=Decimal('100.00')
        )
        self.assertEqual(lesson.trainer, self.trainer)
        self.assertEqual(lesson.student, self.student)
        self.assertEqual(lesson.location, 'Gym A')
        self.assertFalse(lesson.is_completed)


class PaymentModelTest(TestCase):
    """Test the Payment model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='trainee1',
            password='pass123',
            role='TRAINEE'
        )
        self.student = Student.objects.create(user=self.user)

    def test_create_payment(self):
        """Test creating a payment"""
        payment = Payment.objects.create(
            student=self.student,
            amount_ils=Decimal('200.00'),
            method='CASH',
            note='Monthly payment'
        )
        self.assertEqual(payment.student, self.student)
        self.assertEqual(payment.amount_ils, Decimal('200.00'))
        self.assertEqual(payment.method, 'CASH')
        self.assertIsNotNone(payment.paid_at)


class StudentAPITest(APITestCase):
    """Test the Student API endpoints"""

    def setUp(self):
        self.trainer = User.objects.create_user(
            username='trainer1',
            password='pass123',
            role='TRAINER'
        )
        self.trainee = User.objects.create_user(
            username='trainee1',
            password='pass123',
            role='TRAINEE',
            trainer=self.trainer
        )
        self.student = Student.objects.create(
            user=self.trainee,
            phone='1234567890'
        )

    def test_trainer_can_view_their_students(self):
        """Test that trainers can view their students"""
        self.client.force_authenticate(user=self.trainer)
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_trainee_can_view_own_profile(self):
        """Test that trainees can view their own profile"""
        self.client.force_authenticate(user=self.trainee)
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

