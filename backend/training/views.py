# training/views.py
from rest_framework import viewsets, permissions, filters
from .models import Student, Lesson, Payment
from .serializers import StudentSerializer, LessonSerializer, PaymentSerializer


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
