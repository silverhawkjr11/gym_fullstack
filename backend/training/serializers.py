from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student, Lesson, Payment, TrainingSession
from users.models import TrainerProfile, MemberProfile

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "role")


class StudentSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="user"
    )

    class Meta:
        model = Student
        fields = ("id", "user", "user_id", "phone", "notes")

    def validate(self, data):
        user = data["user"]
        # must be a trainee
        if getattr(user, "role", None) != "TRAINEE":
            raise serializers.ValidationError(
                {"user_id": "User must have role TRAINEE."}
            )
        # duplicate one-to-one protection
        if Student.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                {"user_id": "Student profile already exists for this user."}
            )
        return data


class LessonSerializer(serializers.ModelSerializer):
    trainer = UserMiniSerializer(read_only=True)
    trainer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="TRAINER"), write_only=True, source="trainer"
    )

    class Meta:
        model = Lesson
        fields = (
            "id",
            "trainer",
            "trainer_id",
            "student",
            "start",
            "end",
            "location",
            "is_completed",
            "price_ils",
        )

    def validate(self, data):
        if data["end"] <= data["start"]:
            raise serializers.ValidationError("end must be after start")
        return data


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "student", "amount_ils", "paid_at", "method", "note")
        read_only_fields = ("paid_at",)


class TrainingSessionSerializer(serializers.ModelSerializer):
    trainer = serializers.PrimaryKeyRelatedField(
        queryset=TrainerProfile.objects.select_related("user")
    )
    member = serializers.PrimaryKeyRelatedField(
        queryset=MemberProfile.objects.select_related("user")
    )
    trainer_name = serializers.SerializerMethodField()
    member_name = serializers.SerializerMethodField()

    class Meta:
        model = TrainingSession
        fields = (
            "id",
            "trainer",
            "trainer_name",
            "member",
            "member_name",
            "session_type",
            "scheduled_date",
            "duration_minutes",
            "status",
            "notes",
            "price",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def get_trainer_name(self, obj):
        user = obj.trainer.user
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username

    def get_member_name(self, obj):
        user = obj.member.user
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username
