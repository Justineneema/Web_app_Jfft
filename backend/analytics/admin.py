from django.contrib import admin
from .models import Achievement, UserAchievement, UserStats, DailyStreak, AnalyticsEvent


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """Achievement admin"""
    
    list_display = ('name', 'achievement_type', 'rarity', 'points', 'is_active', 'is_premium', 'created_at')
    list_filter = ('achievement_type', 'rarity', 'is_active', 'is_premium', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Basic Info', {'fields': ('name', 'description', 'achievement_type', 'rarity')}),
        ('Requirements', {'fields': ('required_wpm', 'required_accuracy', 'required_sessions', 'required_lessons', 'required_challenges', 'required_voice_sessions')}),
        ('Visual', {'fields': ('icon', 'color', 'points')}),
        ('Settings', {'fields': ('is_active', 'is_premium', 'order')}),
        ('Timestamp', {'fields': ('created_at',)}),
    )


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    """User achievement admin"""
    
    list_display = ('user', 'achievement', 'is_earned', 'progress_percentage', 'earned_at', 'created_at')
    list_filter = ('is_earned', 'achievement__achievement_type', 'earned_at', 'created_at')
    search_fields = ('user__email', 'achievement__name')
    readonly_fields = ('created_at',)


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    """User stats admin"""
    
    list_display = ('user', 'total_sessions', 'average_wpm', 'best_wpm', 'current_level', 'total_points', 'last_activity')
    list_filter = ('current_level', 'last_activity')
    search_fields = ('user__email',)
    readonly_fields = ('last_updated', 'created_at')
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Typing Stats', {'fields': ('total_sessions', 'total_typing_time', 'total_words_typed', 'total_characters_typed')}),
        ('Performance', {'fields': ('average_wpm', 'best_wpm', 'average_accuracy', 'best_accuracy')}),
        ('Progress', {'fields': ('lessons_completed', 'challenges_completed', 'achievements_earned', 'current_streak', 'longest_streak')}),
        ('Voice Stats', {'fields': ('voice_sessions', 'average_pronunciation', 'best_pronunciation')}),
        ('Social', {'fields': ('friends_count', 'times_shared')}),
        ('Leveling', {'fields': ('total_points', 'current_level', 'experience_points')}),
        ('Timestamps', {'fields': ('last_activity', 'last_updated', 'created_at')}),
    )


@admin.register(DailyStreak)
class DailyStreakAdmin(admin.ModelAdmin):
    """Daily streak admin"""
    
    list_display = ('user', 'date', 'sessions_completed', 'words_typed', 'streak_count', 'is_streak_day')
    list_filter = ('is_streak_day', 'date', 'created_at')
    search_fields = ('user__email',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    """Analytics event admin"""
    
    list_display = ('user', 'event_type', 'timestamp', 'ip_address')
    list_filter = ('event_type', 'timestamp')
    search_fields = ('user__email', 'session_id')
    readonly_fields = ('timestamp',)
    
    fieldsets = (
        ('Event Info', {'fields': ('user', 'event_type', 'data', 'session_id')}),
        ('Context', {'fields': ('ip_address', 'user_agent', 'referrer')}),
        ('Timestamp', {'fields': ('timestamp',)}),
    )