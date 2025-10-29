# training/urls.py
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet,
    LessonViewSet,
    PaymentViewSet,
    TrainingSessionViewSet,
    MachineViewSet,
    PlanViewSet,
)

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="student")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"payments", PaymentViewSet, basename="payment")
router.register(r"sessions", TrainingSessionViewSet, basename="session")
router.register(r"machines", MachineViewSet, basename="machine")
router.register(r"plans", PlanViewSet, basename="plan")
urlpatterns = router.urls
