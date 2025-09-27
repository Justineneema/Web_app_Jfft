from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom user admin"""
    
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_premium', 'is_active', 'date_joined')
    list_filter = ('user_type', 'is_premium', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'date_of_birth', 'profile_picture', 'bio')}),
        ('Account type', {'fields': ('user_type', 'is_premium', 'premium_expires_at', 'school')}),
        ('Preferences', {'fields': ('preferred_theme', 'font_size', 'show_errors', 'sound_enabled')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'user_type'),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """User profile admin"""
    
    list_display = ('user', 'current_level', 'average_wpm', 'best_wpm', 'average_accuracy', 'lessons_completed')
    list_filter = ('current_level', 'difficulty_level', 'voice_typing_enabled')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Typing Statistics', {'fields': ('total_typing_time', 'total_words_typed', 'average_wpm', 'best_wpm', 'average_accuracy', 'best_accuracy')}),
        ('Learning Progress', {'fields': ('current_level', 'lessons_completed', 'achievements_count')}),
        ('Preferences', {'fields': ('difficulty_level', 'practice_goal_daily', 'practice_goal_weekly', 'voice_typing_enabled', 'preferred_language', 'voice_speed')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )