# training/urls.py
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, LessonViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="student")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"payments", PaymentViewSet, basename="payment")
urlpatterns = router.urls
