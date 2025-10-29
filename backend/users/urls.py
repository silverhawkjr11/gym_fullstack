from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CreateTraineeView,
    MemberViewSet,
    TrainerViewSet,
    UserLoginView,
    UserRegistrationView,
)

router = DefaultRouter()
router.register(r"members", MemberViewSet, basename="member")
router.register(r"trainers", TrainerViewSet, basename="trainer")

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("trainees/", CreateTraineeView.as_view(), name="create-trainee"),
]

urlpatterns += router.urls
