from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    phone = models.CharField(max_length=30, blank=True)
    notes = models.TextField(blank=True, default="")

    def __str__(self):
        return getattr(self.user, "username", "student")

class Lesson(models.Model):
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lessons_as_trainer")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="lessons")
    start = models.DateTimeField()
    end = models.DateTimeField()
    location = models.CharField(max_length=120, blank=True)
    is_completed = models.BooleanField(default=False)
    price_ils = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        ordering = ["-start"]
        indexes = [models.Index(fields=["trainer", "start"])]

class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="payments")
    amount_ils = models.DecimalField(max_digits=8, decimal_places=2)
    paid_at = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=32, choices=[("CASH","Cash"),("CARD","Card"),("TRANSFER","Transfer")])
    note = models.CharField(max_length=140, blank=True)

    class Meta:
        ordering = ["-paid_at"]


class TrainingSession(models.Model):
    SESSION_TYPES = [
        ("personal", "Personal"),
        ("group", "Group"),
        ("class", "Class"),
    ]
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    trainer = models.ForeignKey(
        "users.TrainerProfile",
        on_delete=models.CASCADE,
        related_name="training_sessions",
    )
    member = models.ForeignKey(
        "users.MemberProfile",
        on_delete=models.CASCADE,
        related_name="training_sessions",
    )
    session_type = models.CharField(max_length=16, choices=SESSION_TYPES)
    scheduled_date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="scheduled")
    notes = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-scheduled_date"]
        indexes = [
            models.Index(fields=["trainer", "scheduled_date"]),
            models.Index(fields=["member", "scheduled_date"]),
        ]

    def __str__(self):
        return f"Session({self.session_type}) on {self.scheduled_date:%Y-%m-%d}"
