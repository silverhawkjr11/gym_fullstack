# users/urls.py
from django.urls import path
from .views import CreateTraineeView

urlpatterns = [
    path("trainees/", CreateTraineeView.as_view(), name="create-trainee"),
]
