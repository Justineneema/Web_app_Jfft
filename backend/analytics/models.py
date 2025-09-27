from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Achievement(models.Model):
    """Achievement badges and certificates"""
    
    ACHIEVEMENT_TYPES = [
        ('speed', 'Speed Achievement'),
        ('accuracy', 'Accuracy Achievement'),
        ('consistency', 'Consistency Achievement'),
        ('endurance', 'Endurance Achievement'),
        ('lesson', 'Lesson Completion'),
        ('challenge', 'Challenge Completion'),
        ('voice', 'Voice Typing Achievement'),
        ('social', 'Social Achievement'),
        ('special', 'Special Achievement'),
    ]
    
    RARITY_LEVELS = [
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    rarity = models.CharField(max_length=20, choices=RARITY_LEVELS, default='common')
    
    # Requirements
    required_wpm = models.PositiveIntegerField(null=True, blank=True)
    required_accuracy = models.PositiveIntegerField(null=True, blank=True)
    required_sessions = models.PositiveIntegerField(null=True, blank=True)
    required_lessons = models.PositiveIntegerField(null=True, blank=True)
    required_challenges = models.PositiveIntegerField(null=True, blank=True)
    required_voice_sessions = models.PositiveIntegerField(null=True, blank=True)
    
    # Visual
    icon = models.CharField(max_length=100, help_text="Icon class or filename")
    color = models.CharField(max_length=7, default='#FFD700', help_text="Hex color code")
    points = models.PositiveIntegerField(default=10)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievements'
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'
        ordering = ['rarity', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.get_rarity_display()})"


class UserAchievement(models.Model):
    """User's earned achievements"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    
    # Progress tracking
    progress_percentage = models.PositiveIntegerField(default=0)
    is_earned = models.BooleanField(default=False)
    earned_at = models.DateTimeField(null=True, blank=True)
    
    # Context
    earned_in_session = models.ForeignKey('typing_practice.TypingSession', on_delete=models.SET_NULL, null=True, blank=True)
    earned_in_lesson = models.ForeignKey('typing_practice.TypingLesson', on_delete=models.SET_NULL, null=True, blank=True)
    earned_in_challenge = models.ForeignKey('typing_practice.TypingChallenge', on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_achievements'
        verbose_name = 'User Achievement'
        verbose_name_plural = 'User Achievements'
        unique_together = ['user', 'achievement']
    
    def __str__(self):
        status = "Earned" if self.is_earned else "In Progress"
        return f"{self.user.email} - {self.achievement.name} ({status})"


class UserStats(models.Model):
    """Aggregated user statistics"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    
    # Typing statistics
    total_sessions = models.PositiveIntegerField(default=0)
    total_typing_time = models.DurationField(default=timezone.timedelta(0))
    total_words_typed = models.PositiveIntegerField(default=0)
    total_characters_typed = models.PositiveIntegerField(default=0)
    
    # Performance metrics
    average_wpm = models.FloatField(default=0.0)
    best_wpm = models.FloatField(default=0.0)
    average_accuracy = models.FloatField(default=0.0)
    best_accuracy = models.FloatField(default=0.0)
    
    # Learning progress
    lessons_completed = models.PositiveIntegerField(default=0)
    challenges_completed = models.PositiveIntegerField(default=0)
    achievements_earned = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    
    # Voice typing stats
    voice_sessions = models.PositiveIntegerField(default=0)
    average_pronunciation = models.FloatField(default=0.0)
    best_pronunciation = models.FloatField(default=0.0)
    
    # Social stats
    friends_count = models.PositiveIntegerField(default=0)
    times_shared = models.PositiveIntegerField(default=0)
    
    # Points and leveling
    total_points = models.PositiveIntegerField(default=0)
    current_level = models.PositiveIntegerField(default=1)
    experience_points = models.PositiveIntegerField(default=0)
    
    # Timestamps
    last_activity = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_stats'
        verbose_name = 'User Statistics'
        verbose_name_plural = 'User Statistics'
    
    def __str__(self):
        return f"{self.user.email} - Stats"
    
    def calculate_level(self):
        """Calculate user level based on experience points"""
        # Simple leveling system: each level requires 1000 * level XP
        level = 1
        xp = self.experience_points
        
        while xp >= level * 1000:
            xp -= level * 1000
            level += 1
        
        return level
    
    def add_experience(self, points):
        """Add experience points and update level"""
        self.experience_points += points
        new_level = self.calculate_level()
        
        if new_level > self.current_level:
            self.current_level = new_level
            return True  # Level up!
        
        return False


class DailyStreak(models.Model):
    """Track daily typing streaks"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_streaks')
    date = models.DateField()
    sessions_completed = models.PositiveIntegerField(default=0)
    total_time = models.DurationField(default=timezone.timedelta(0))
    words_typed = models.PositiveIntegerField(default=0)
    
    # Streak tracking
    is_streak_day = models.BooleanField(default=True)
    streak_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'daily_streaks'
        verbose_name = 'Daily Streak'
        verbose_name_plural = 'Daily Streaks'
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.email} - {self.date} (Streak: {self.streak_count})"


class AnalyticsEvent(models.Model):
    """Track user events for analytics"""
    
    EVENT_TYPES = [
        ('session_start', 'Session Started'),
        ('session_complete', 'Session Completed'),
        ('lesson_start', 'Lesson Started'),
        ('lesson_complete', 'Lesson Completed'),
        ('challenge_start', 'Challenge Started'),
        ('challenge_complete', 'Challenge Completed'),
        ('achievement_earned', 'Achievement Earned'),
        ('voice_session', 'Voice Session'),
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('profile_update', 'Profile Updated'),
        ('settings_change', 'Settings Changed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics_events')
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    
    # Event data
    data = models.JSONField(default=dict, blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    
    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_events'
        verbose_name = 'Analytics Event'
        verbose_name_plural = 'Analytics Events'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'event_type']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.get_event_type_display()} ({self.timestamp})"