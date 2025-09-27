from rest_framework import serializers
from .models import (
    VoiceTypingSession, VoiceTypingExercise, VoiceTypingProgress,
    PronunciationGuide, VoiceTypingSettings
)


class VoiceTypingSessionSerializer(serializers.ModelSerializer):
    """Voice typing session serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    is_high_confidence = serializers.ReadOnlyField()
    pronunciation_rating = serializers.ReadOnlyField()
    
    class Meta:
        model = VoiceTypingSession
        fields = [
            'id', 'user', 'user_email', 'language', 'audio_file', 'transcript',
            'confidence_score', 'words_spoken', 'words_per_minute', 'accuracy',
            'pronunciation_score', 'mispronounced_words', 'unclear_segments',
            'suggested_improvements', 'duration', 'started_at', 'completed_at',
            'is_high_confidence', 'pronunciation_rating', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class VoiceTypingExerciseSerializer(serializers.ModelSerializer):
    """Voice typing exercise serializer"""
    
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = VoiceTypingExercise
        fields = [
            'id', 'title', 'description', 'difficulty', 'language',
            'text_to_speak', 'expected_words', 'pronunciation_hints',
            'target_wpm', 'target_accuracy', 'target_pronunciation',
            'time_limit_minutes', 'is_premium', 'order', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VoiceTypingProgressSerializer(serializers.ModelSerializer):
    """Voice typing progress serializer"""
    
    exercise_title = serializers.CharField(source='exercise.title', read_only=True)
    exercise_difficulty = serializers.CharField(source='exercise.difficulty', read_only=True)
    
    class Meta:
        model = VoiceTypingProgress
        fields = [
            'id', 'exercise', 'exercise_title', 'exercise_difficulty',
            'attempts', 'best_wpm', 'best_accuracy', 'best_pronunciation',
            'total_time', 'is_completed', 'completed_at', 'mastery_level',
            'started_at', 'last_attempted'
        ]
        read_only_fields = ['id', 'last_attempted']


class PronunciationGuideSerializer(serializers.ModelSerializer):
    """Pronunciation guide serializer"""
    
    class Meta:
        model = PronunciationGuide
        fields = [
            'id', 'word', 'language', 'phonetic_spelling', 'audio_file',
            'difficulty_level', 'common_mispronunciations', 'tips',
            'usage_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'usage_count', 'created_at', 'updated_at']


class VoiceTypingSettingsSerializer(serializers.ModelSerializer):
    """Voice typing settings serializer"""
    
    class Meta:
        model = VoiceTypingSettings
        fields = [
            'preferred_language', 'voice_speed', 'voice_pitch',
            'auto_punctuation', 'profanity_filter', 'confidence_threshold',
            'show_confidence_scores', 'show_pronunciation_hints',
            'audio_feedback', 'practice_mode', 'repeat_exercises',
            'adaptive_difficulty', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']