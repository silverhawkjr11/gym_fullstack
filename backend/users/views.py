from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, permissions, status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    TraineeCreateSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    MemberProfileSerializer,
    TrainerProfileSerializer,
    MemberCreateSerializer,
    TrainerCreateSerializer,
)
from .models import MemberProfile, TrainerProfile


class UserRegistrationView(generics.CreateAPIView):
    """Public endpoint for user registration"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "message": "User registered successfully. Please login."
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response(
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                # these two lines are safe even if one is missing:
                "role": getattr(u, "role", None),
                "trainer_id": getattr(u, "trainer_id", None),
                "is_active": u.is_active,
            }
        )


class IsTrainer(permissions.BasePermission):
    """Only trainers or admins can create trainees."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ["TRAINER", "ADMIN"]
        )


class CreateTraineeView(generics.CreateAPIView):
    serializer_class = TraineeCreateSerializer
    permission_classes = [IsTrainer]


class UserLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = TrainerProfile.objects.select_related("user").all()
    serializer_class = TrainerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return TrainerCreateSerializer
        return TrainerProfileSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = MemberProfile.objects.select_related("user").all()
    serializer_class = MemberProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return MemberCreateSerializer
        return MemberProfileSerializer
