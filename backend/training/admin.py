from django.contrib import admin
from .models import Student, Lesson, Payment

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'get_trainer')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone')
    list_filter = ('user__role',)
    raw_id_fields = ('user',)
    
    def get_trainer(self, obj):
        return obj.user.trainer.username if obj.user.trainer else '-'
    get_trainer.short_description = 'Trainer'

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('student', 'trainer', 'start', 'end', 'location', 'is_completed', 'price_ils')
    list_filter = ('is_completed', 'start', 'trainer')
    search_fields = ('student__user__username', 'trainer__username', 'location')
    date_hierarchy = 'start'
    raw_id_fields = ('student', 'trainer')
    list_editable = ('is_completed',)
    ordering = ('-start',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'amount_ils', 'method', 'paid_at', 'note')
    list_filter = ('method', 'paid_at')
    search_fields = ('student__user__username', 'note')
    date_hierarchy = 'paid_at'
    raw_id_fields = ('student',)
    readonly_fields = ('paid_at',)
    ordering = ('-paid_at',)
