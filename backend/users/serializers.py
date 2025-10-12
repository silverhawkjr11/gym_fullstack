# users/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


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
