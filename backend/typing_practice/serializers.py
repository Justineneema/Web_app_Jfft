from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    TypingText, TypingSession, TypingLesson, LessonText,
    UserLessonProgress, TypingChallenge, ChallengeParticipation
)

User = get_user_model()


class TypingTextSerializer(serializers.ModelSerializer):
    """Typing text serializer"""
    
    class Meta:
        model = TypingText
        fields = [
            'id', 'title', 'content', 'difficulty', 'category',
            'word_count', 'character_count', 'estimated_time',
            'author', 'source', 'is_premium', 'created_at'
        ]
        read_only_fields = ['id', 'word_count', 'character_count', 'created_at']


class TypingSessionSerializer(serializers.ModelSerializer):
    """Typing session serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    text_title = serializers.CharField(source='typing_text.title', read_only=True)
    error_rate = serializers.ReadOnlyField()
    session_duration_minutes = serializers.ReadOnlyField()
    
    class Meta:
        model = TypingSession
        fields = [
            'id', 'user', 'user_email', 'typing_text', 'text_title',
            'session_type', 'words_per_minute', 'accuracy', 'words_typed',
            'characters_typed', 'errors_made', 'time_taken', 'error_rate',
            'correct_characters', 'incorrect_characters', 'backspaces_used',
            'pauses_count', 'average_pause_duration', 'started_at',
            'completed_at', 'is_completed', 'is_practice_mode',
            'voice_accuracy', 'pronunciation_score', 'session_duration_minutes',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TypingSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating typing sessions"""
    
    class Meta:
        model = TypingSession
        fields = [
            'typing_text', 'session_type', 'words_per_minute', 'accuracy',
            'words_typed', 'characters_typed', 'errors_made', 'time_taken',
            'correct_characters', 'incorrect_characters', 'backspaces_used',
            'pauses_count', 'average_pause_duration', 'started_at',
            'completed_at', 'is_practice_mode', 'voice_accuracy',
            'pronunciation_score'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TypingLessonSerializer(serializers.ModelSerializer):
    """Typing lesson serializer"""
    
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = TypingLesson
        fields = [
            'id', 'title', 'description', 'difficulty', 'order',
            'is_active', 'instructions', 'focus_keys', 'target_wpm',
            'target_accuracy', 'prerequisite_lessons', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LessonTextSerializer(serializers.ModelSerializer):
    """Lesson text serializer"""
    
    text_title = serializers.CharField(source='typing_text.title', read_only=True)
    text_content = serializers.CharField(source='typing_text.content', read_only=True)
    text_difficulty = serializers.CharField(source='typing_text.difficulty', read_only=True)
    
    class Meta:
        model = LessonText
        fields = [
            'id', 'lesson', 'typing_text', 'text_title', 'text_content',
            'text_difficulty', 'order', 'is_required'
        ]


class UserLessonProgressSerializer(serializers.ModelSerializer):
    """User lesson progress serializer"""
    
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    lesson_difficulty = serializers.CharField(source='lesson.difficulty', read_only=True)
    
    class Meta:
        model = UserLessonProgress
        fields = [
            'id', 'lesson', 'lesson_title', 'lesson_difficulty', 'status',
            'attempts', 'best_wpm', 'best_accuracy', 'time_spent',
            'started_at', 'completed_at', 'last_attempted'
        ]
        read_only_fields = ['id', 'last_attempted']


class TypingChallengeSerializer(serializers.ModelSerializer):
    """Typing challenge serializer"""
    
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_ongoing = serializers.ReadOnlyField()
    participant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TypingChallenge
        fields = [
            'id', 'title', 'description', 'challenge_type', 'duration_minutes',
            'target_wpm', 'target_accuracy', 'min_participants', 'max_participants',
            'start_date', 'end_date', 'is_active', 'is_ongoing', 'points_reward',
            'badge_reward', 'created_by_name', 'participant_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_participant_count(self, obj):
        return obj.participations.count()


class ChallengeParticipationSerializer(serializers.ModelSerializer):
    """Challenge participation serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    
    class Meta:
        model = ChallengeParticipation
        fields = [
            'id', 'user', 'user_email', 'challenge', 'challenge_title',
            'best_wpm', 'best_accuracy', 'total_sessions', 'total_time',
            'rank', 'points_earned', 'joined_at', 'last_activity'
        ]
        read_only_fields = ['id', 'joined_at', 'last_activity']


class ChallengeParticipationCreateSerializer(serializers.ModelSerializer):
    """Serializer for joining challenges"""
    
    class Meta:
        model = ChallengeParticipation
        fields = ['challenge']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)