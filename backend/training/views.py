# training/views.py
from rest_framework import viewsets, permissions, filters
from .models import Student, Lesson, Payment, TrainingSession, Machine, Plan
from .serializers import (
    StudentSerializer,
    LessonSerializer,
    PaymentSerializer,
    TrainingSessionSerializer,
    MachineSerializer,
    PlanSerializer,
)


class IsAdminOrTrainerReadOwn(permissions.BasePermission):
    def has_permission(self, req, view):
        return req.user and req.user.is_authenticated

    def has_object_permission(self, req, view, obj):
        u = req.user
        if getattr(u, "role", None) == "ADMIN":
            return True
        if isinstance(obj, Student):
            return (
                (u.role == "TRAINER")
                and (obj.user.trainer_id == u.id)
                or (u.role == "TRAINEE" and obj.user_id == u.id)
            )
        if isinstance(obj, Lesson):
            if u.role == "TRAINER":
                return obj.trainer_id == u.id
            if u.role == "TRAINEE":
                return obj.student.user_id == u.id
        if isinstance(obj, Payment):
            if u.role == "TRAINER":
                return obj.student.user.trainer_id == u.id
            if u.role == "TRAINEE":
                return obj.student.user_id == u.id
        if isinstance(obj, TrainingSession):
            if u.role == "TRAINER":
                return obj.trainer.user_id == u.id
            if u.role == "TRAINEE":
                return obj.member.user_id == u.id
        return False


class BaseViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


class StudentViewSet(BaseViewSet):
    print("in student viewset")
    queryset = Student.objects.select_related("user")
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrTrainerReadOwn]
    search_fields = ["user__username", "user__first_name", "user__last_name"]

    def get_queryset(self):
        u = self.request.user
        if u.role == "ADMIN":
            return super().get_queryset()
        if u.role == "TRAINER":
            return super().get_queryset().filter(user__trainer_id=u.id)
        return super().get_queryset().filter(user_id=u.id)


class LessonViewSet(BaseViewSet):
    queryset = Lesson.objects.select_related("trainer", "student", "student__user")
    serializer_class = LessonSerializer
    permission_classes = [IsAdminOrTrainerReadOwn]
    search_fields = ["location", "student__user__username"]
    ordering_fields = ["start", "end", "price_ils"]

    def get_queryset(self):
        u = self.request.user
        if u.role == "ADMIN":
            return super().get_queryset()
        if u.role == "TRAINER":
            return super().get_queryset().filter(trainer_id=u.id)
        return super().get_queryset().filter(student__user_id=u.id)


class PaymentViewSet(BaseViewSet):
    queryset = Payment.objects.select_related("student", "student__user")
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrTrainerReadOwn]
    search_fields = ["method", "note"]
    ordering_fields = ["paid_at", "amount_ils"]

    def get_queryset(self):
        u = self.request.user
        if u.role == "ADMIN":
            return super().get_queryset()
        if u.role == "TRAINER":
            return super().get_queryset().filter(student__user__trainer_id=u.id)
        return super().get_queryset().filter(student__user_id=u.id)


class TrainingSessionViewSet(BaseViewSet):
    queryset = TrainingSession.objects.select_related(
        "trainer__user", "member__user"
    )
    serializer_class = TrainingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["session_type", "status", "notes"]
    ordering_fields = ["scheduled_date", "duration_minutes", "price"]

    def get_queryset(self):
        qs = super().get_queryset()
        u = self.request.user
        role = getattr(u, "role", None)
        if role == "ADMIN":
            return qs
        if role == "TRAINER":
            return qs.filter(trainer__user_id=u.id)
        if role == "TRAINEE":
            return qs.filter(member__user_id=u.id)
        return qs.none()


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["code", "name", "description"]
    ordering_fields = ["name", "code", "created_at"]


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.select_related("trainee")
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["description", "trainee__username"]
    ordering_fields = ["created_at", "trainee__username"]

    def get_queryset(self):
        qs = super().get_queryset()
        u = self.request.user
        role = getattr(u, "role", None)

        # Filter by trainee_id query param if provided
        trainee_id = self.request.query_params.get('trainee_id')
        if trainee_id:
            qs = qs.filter(trainee_id=trainee_id)

        if role == "ADMIN":
            return qs
        if role == "TRAINER":
            # Trainers can see plans for their trainees
            return qs.filter(trainee__trainer_id=u.id)
        if role == "TRAINEE":
            # Trainees can only see their own plans
            return qs.filter(trainee_id=u.id)
        return qs.none()
