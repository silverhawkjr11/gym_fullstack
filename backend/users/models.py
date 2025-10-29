from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        TRAINER = "TRAINER", "Trainer"
        TRAINEE = "TRAINEE", "Trainee"

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.TRAINEE)
    trainer = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="trainees",
        limit_choices_to={"role": Role.TRAINER},
    )


class TimestampedModel(models.Model):
    """Abstract base model with created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TrainerProfile(TimestampedModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="trainer_profile",
        limit_choices_to={"role": User.Role.TRAINER},
    )
    specialization = models.CharField(max_length=120)
    experience_years = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"TrainerProfile(user={self.user.username})"


class MemberProfile(TimestampedModel):
    BASIC = "basic"
    PREMIUM = "premium"
    VIP = "vip"
    MEMBERSHIP_CHOICES = [
        (BASIC, "Basic"),
        (PREMIUM, "Premium"),
        (VIP, "VIP"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="member_profile",
        limit_choices_to={"role": User.Role.TRAINEE},
    )
    membership_type = models.CharField(
        max_length=16, choices=MEMBERSHIP_CHOICES, default=BASIC
    )
    membership_start_date = models.DateField()
    membership_end_date = models.DateField()
    emergency_contact = models.CharField(max_length=140, blank=True)
    medical_conditions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"MemberProfile(user={self.user.username})"
