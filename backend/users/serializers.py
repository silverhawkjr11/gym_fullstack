# users/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import MemberProfile, TrainerProfile

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for public user registration"""
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password", "password_confirm")

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            password=validated_data["password"],
            role="TRAINEE",  # Default role for public registration
        )


class TraineeCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password")

    def create(self, validated_data):
        trainer = self.context["request"].user
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role="TRAINEE",
            trainer=trainer,
        )


class UserLoginSerializer(TokenObtainPairSerializer):
    """Extend JWT login to include user details in the response payload."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = getattr(user, "role", None)
        token["trainer_id"] = getattr(user, "trainer_id", None)
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": getattr(user, "role", None),
            "trainer_id": getattr(user, "trainer_id", None),
            "is_active": user.is_active,
        }
        return data


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
        )


class TrainerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.TRAINER)
    )
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = TrainerProfile
        fields = (
            "id",
            "user",
            "username",
            "email",
            "first_name",
            "last_name",
            "specialization",
            "experience_years",
            "bio",
            "hourly_rate",
            "is_available",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class MemberProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.TRAINEE)
    )
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = MemberProfile
        fields = (
            "id",
            "user",
            "username",
            "email",
            "first_name",
            "last_name",
            "membership_type",
            "membership_start_date",
            "membership_end_date",
            "is_active",
            "emergency_contact",
            "medical_conditions",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def validate(self, attrs):
        start = attrs.get("membership_start_date")
        end = attrs.get("membership_end_date")
        if start and end and end < start:
            raise serializers.ValidationError(
                {"membership_end_date": "End date must be after start date."}
            )
        return attrs


class MemberCreateSerializer(serializers.Serializer):
    """Create a User and MemberProfile in one transaction"""
    # User fields
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=4)

    # Member profile fields
    membership_type = serializers.ChoiceField(choices=MemberProfile.MEMBERSHIP_CHOICES, default=MemberProfile.BASIC)
    membership_start_date = serializers.DateField()
    membership_end_date = serializers.DateField()
    emergency_contact = serializers.CharField(max_length=140, required=False, allow_blank=True)
    medical_conditions = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(default=True)

    def validate(self, attrs):
        if attrs['membership_end_date'] < attrs['membership_start_date']:
            raise serializers.ValidationError(
                {"membership_end_date": "End date must be after start date."}
            )
        return attrs

    def create(self, validated_data):
        # Extract profile fields
        profile_fields = {
            'membership_type': validated_data.pop('membership_type', MemberProfile.BASIC),
            'membership_start_date': validated_data.pop('membership_start_date'),
            'membership_end_date': validated_data.pop('membership_end_date'),
            'emergency_contact': validated_data.pop('emergency_contact', ''),
            'medical_conditions': validated_data.pop('medical_conditions', ''),
            'is_active': validated_data.pop('is_active', True),
        }

        # Create user with TRAINEE role
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            role=User.Role.TRAINEE,
        )

        # Create member profile
        member_profile = MemberProfile.objects.create(user=user, **profile_fields)

        return member_profile


class TrainerCreateSerializer(serializers.Serializer):
    """Create a User and TrainerProfile in one transaction"""
    # User fields
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=4)

    # Trainer profile fields
    specialization = serializers.CharField(max_length=120)
    experience_years = serializers.IntegerField(default=0)
    bio = serializers.CharField(required=False, allow_blank=True)
    hourly_rate = serializers.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_available = serializers.BooleanField(default=True)

    def create(self, validated_data):
        # Extract profile fields
        profile_fields = {
            'specialization': validated_data.pop('specialization'),
            'experience_years': validated_data.pop('experience_years', 0),
            'bio': validated_data.pop('bio', ''),
            'hourly_rate': validated_data.pop('hourly_rate', 0),
            'is_available': validated_data.pop('is_available', True),
        }

        # Create user with TRAINER role
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            role=User.Role.TRAINER,
        )

        # Create trainer profile
        trainer_profile = TrainerProfile.objects.create(user=user, **profile_fields)

        return trainer_profile
