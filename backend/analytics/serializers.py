from rest_framework import serializers
from .models import Achievement, UserAchievement, UserStats, DailyStreak, AnalyticsEvent


class AchievementSerializer(serializers.ModelSerializer):
    """Achievement serializer"""
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'achievement_type', 'rarity',
            'required_wpm', 'required_accuracy', 'required_sessions',
            'required_lessons', 'required_challenges', 'required_voice_sessions',
            'icon', 'color', 'points', 'is_premium', 'order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserAchievementSerializer(serializers.ModelSerializer):
    """User achievement serializer"""
    
    achievement_name = serializers.CharField(source='achievement.name', read_only=True)
    achievement_description = serializers.CharField(source='achievement.description', read_only=True)
    achievement_icon = serializers.CharField(source='achievement.icon', read_only=True)
    achievement_color = serializers.CharField(source='achievement.color', read_only=True)
    achievement_points = serializers.IntegerField(source='achievement.points', read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = [
            'id', 'achievement', 'achievement_name', 'achievement_description',
            'achievement_icon', 'achievement_color', 'achievement_points',
            'progress_percentage', 'is_earned', 'earned_at', 'earned_in_session',
            'earned_in_lesson', 'earned_in_challenge', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserStatsSerializer(serializers.ModelSerializer):
    """User stats serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = UserStats
        fields = [
            'id', 'user', 'user_email', 'user_name', 'total_sessions',
            'total_typing_time', 'total_words_typed', 'total_characters_typed',
            'average_wpm', 'best_wpm', 'average_accuracy', 'best_accuracy',
            'lessons_completed', 'challenges_completed', 'achievements_earned',
            'current_streak', 'longest_streak', 'voice_sessions',
            'average_pronunciation', 'best_pronunciation', 'friends_count',
            'times_shared', 'total_points', 'current_level', 'experience_points',
            'last_activity', 'last_updated', 'created_at'
        ]
        read_only_fields = ['id', 'last_updated', 'created_at']


class DailyStreakSerializer(serializers.ModelSerializer):
    """Daily streak serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = DailyStreak
        fields = [
            'id', 'user', 'user_email', 'date', 'sessions_completed',
            'total_time', 'words_typed', 'is_streak_day', 'streak_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AnalyticsEventSerializer(serializers.ModelSerializer):
    """Analytics event serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'user', 'user_email', 'event_type', 'data', 'session_id',
            'ip_address', 'user_agent', 'referrer', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']