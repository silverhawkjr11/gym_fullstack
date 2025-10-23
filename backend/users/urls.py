# users/urls.py
from django.urls import path
from .views import CreateTraineeView, UserRegistrationView

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("trainees/", CreateTraineeView.as_view(), name="create-trainee"),
]
