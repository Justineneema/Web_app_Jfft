from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer for API responses"""
    
    full_name = serializers.ReadOnlyField()
    is_premium_active = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'user_type', 'date_of_birth', 'profile_picture', 'bio',
            'is_premium', 'is_premium_active', 'premium_expires_at',
            'preferred_theme', 'font_size', 'show_errors', 'sound_enabled',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serializer"""
    
    typing_level = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProfile
        fields = [
            'total_typing_time', 'total_words_typed', 'average_wpm', 'best_wpm',
            'average_accuracy', 'best_accuracy', 'current_level', 'lessons_completed',
            'achievements_count', 'difficulty_level', 'practice_goal_daily',
            'practice_goal_weekly', 'voice_typing_enabled', 'preferred_language',
            'voice_speed', 'typing_level'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer"""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'password',
            'password_confirm', 'user_type', 'date_of_birth'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """User update serializer"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'profile_picture',
            'bio', 'preferred_theme', 'font_size', 'show_errors', 'sound_enabled'
        ]


class PasswordChangeSerializer(serializers.Serializer):
    """Password change serializer"""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value