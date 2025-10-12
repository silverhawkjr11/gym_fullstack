from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        TRAINER = "TRAINER", "Trainer"
        TRAINEE = "TRAINEE", "Trainee"

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.TRAINEE)
    trainer = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="trainees"
    )
