# users/urls.py
from django.urls import path
from .views import CreateTraineeView, UserRegistrationView, UserLoginView

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("trainees/", CreateTraineeView.as_view(), name="create-trainee"),
]
