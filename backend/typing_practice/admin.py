from django.contrib import admin
from .models import (
    TypingText, TypingSession, TypingLesson, LessonText,
    UserLessonProgress, TypingChallenge, ChallengeParticipation
)


@admin.register(TypingText)
class TypingTextAdmin(admin.ModelAdmin):
    """Typing text admin"""
    
    list_display = ('title', 'difficulty', 'category', 'word_count', 'is_premium', 'is_active', 'created_at')
    list_filter = ('difficulty', 'category', 'is_premium', 'is_active', 'school', 'created_at')
    search_fields = ('title', 'content', 'author')
    readonly_fields = ('word_count', 'character_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Content', {'fields': ('title', 'content', 'difficulty', 'category')}),
        ('Metadata', {'fields': ('author', 'source', 'is_premium', 'is_active')}),
        ('Auto-calculated', {'fields': ('word_count', 'character_count', 'estimated_time')}),
        ('School', {'fields': ('school', 'created_by')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(TypingSession)
class TypingSessionAdmin(admin.ModelAdmin):
    """Typing session admin"""
    
    list_display = ('user', 'typing_text', 'session_type', 'words_per_minute', 'accuracy', 'is_completed', 'created_at')
    list_filter = ('session_type', 'is_completed', 'is_practice_mode', 'created_at')
    search_fields = ('user__email', 'typing_text__title')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Session Info', {'fields': ('user', 'typing_text', 'session_type', 'is_practice_mode')}),
        ('Performance', {'fields': ('words_per_minute', 'accuracy', 'words_typed', 'characters_typed', 'errors_made')}),
        ('Details', {'fields': ('correct_characters', 'incorrect_characters', 'backspaces_used', 'pauses_count', 'average_pause_duration')}),
        ('Timing', {'fields': ('time_taken', 'started_at', 'completed_at', 'is_completed')}),
        ('Voice Typing', {'fields': ('voice_accuracy', 'pronunciation_score')}),
        ('Timestamp', {'fields': ('created_at',)}),
    )


@admin.register(TypingLesson)
class TypingLessonAdmin(admin.ModelAdmin):
    """Typing lesson admin"""
    
    list_display = ('title', 'difficulty', 'order', 'is_active', 'created_at')
    list_filter = ('difficulty', 'is_active', 'school', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Lesson Info', {'fields': ('title', 'description', 'difficulty', 'order', 'is_active')}),
        ('Content', {'fields': ('instructions', 'focus_keys')}),
        ('Requirements', {'fields': ('target_wpm', 'target_accuracy')}),
        ('Prerequisites', {'fields': ('prerequisite_lessons',)}),
        ('School', {'fields': ('school', 'created_by')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(LessonText)
class LessonTextAdmin(admin.ModelAdmin):
    """Lesson text admin"""
    
    list_display = ('lesson', 'typing_text', 'order', 'is_required')
    list_filter = ('is_required', 'lesson__difficulty')
    search_fields = ('lesson__title', 'typing_text__title')


@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    """User lesson progress admin"""
    
    list_display = ('user', 'lesson', 'status', 'attempts', 'best_wpm', 'best_accuracy', 'last_attempted')
    list_filter = ('status', 'lesson__difficulty', 'last_attempted')
    search_fields = ('user__email', 'lesson__title')
    readonly_fields = ('last_attempted',)


@admin.register(TypingChallenge)
class TypingChallengeAdmin(admin.ModelAdmin):
    """Typing challenge admin"""
    
    list_display = ('title', 'challenge_type', 'start_date', 'end_date', 'is_active', 'created_at')
    list_filter = ('challenge_type', 'is_active', 'school', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Challenge Info', {'fields': ('title', 'description', 'challenge_type', 'is_active')}),
        ('Parameters', {'fields': ('duration_minutes', 'target_wpm', 'target_accuracy', 'min_participants', 'max_participants')}),
        ('Timing', {'fields': ('start_date', 'end_date')}),
        ('Rewards', {'fields': ('points_reward', 'badge_reward')}),
        ('School', {'fields': ('school', 'created_by')}),
        ('Timestamp', {'fields': ('created_at',)}),
    )


@admin.register(ChallengeParticipation)
class ChallengeParticipationAdmin(admin.ModelAdmin):
    """Challenge participation admin"""
    
    list_display = ('user', 'challenge', 'rank', 'best_wpm', 'best_accuracy', 'points_earned', 'joined_at')
    list_filter = ('challenge__challenge_type', 'joined_at')
    search_fields = ('user__email', 'challenge__title')
    readonly_fields = ('joined_at', 'last_activity')