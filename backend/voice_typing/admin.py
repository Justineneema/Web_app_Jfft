from django.contrib import admin
from .models import (
    VoiceTypingSession, VoiceTypingExercise, VoiceTypingProgress,
    PronunciationGuide, VoiceTypingSettings
)


@admin.register(VoiceTypingSession)
class VoiceTypingSessionAdmin(admin.ModelAdmin):
    """Voice typing session admin"""
    
    list_display = ('user', 'language', 'words_per_minute', 'accuracy', 'pronunciation_score', 'created_at')
    list_filter = ('language', 'created_at')
    search_fields = ('user__email', 'transcript')
    readonly_fields = ('created_at',)


@admin.register(VoiceTypingExercise)
class VoiceTypingExerciseAdmin(admin.ModelAdmin):
    """Voice typing exercise admin"""
    
    list_display = ('title', 'difficulty', 'language', 'is_active', 'is_premium', 'order', 'created_at')
    list_filter = ('difficulty', 'language', 'is_active', 'is_premium', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(VoiceTypingProgress)
class VoiceTypingProgressAdmin(admin.ModelAdmin):
    """Voice typing progress admin"""
    
    list_display = ('user', 'exercise', 'attempts', 'best_wpm', 'best_accuracy', 'is_completed', 'last_attempted')
    list_filter = ('is_completed', 'exercise__difficulty', 'last_attempted')
    search_fields = ('user__email', 'exercise__title')
    readonly_fields = ('last_attempted',)


@admin.register(PronunciationGuide)
class PronunciationGuideAdmin(admin.ModelAdmin):
    """Pronunciation guide admin"""
    
    list_display = ('word', 'language', 'difficulty_level', 'usage_count', 'is_active', 'created_at')
    list_filter = ('language', 'difficulty_level', 'is_active', 'created_at')
    search_fields = ('word', 'phonetic_spelling')
    readonly_fields = ('usage_count', 'created_at', 'updated_at')


@admin.register(VoiceTypingSettings)
class VoiceTypingSettingsAdmin(admin.ModelAdmin):
    """Voice typing settings admin"""
    
    list_display = ('user', 'preferred_language', 'voice_speed', 'practice_mode', 'updated_at')
    list_filter = ('preferred_language', 'practice_mode', 'audio_feedback')
    search_fields = ('user__email',)
    readonly_fields = ('created_at', 'updated_at')