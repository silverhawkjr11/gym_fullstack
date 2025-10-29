from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, TrainerProfile, MemberProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Gym Fields', {'fields': ('role', 'trainer')}),
    )
    list_display = ('username', 'email', 'role', 'is_active', 'trainer')
    list_filter = ('role', 'is_active')


@admin.register(TrainerProfile)
class TrainerProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'specialization',
        'experience_years',
        'hourly_rate',
        'is_available',
        'updated_at',
    )
    list_filter = ('is_available', 'specialization')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'membership_type',
        'membership_start_date',
        'membership_end_date',
        'is_active',
        'updated_at',
    )
    list_filter = ('membership_type', 'is_active')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
