from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class TypingText(models.Model):
    """Text content for typing practice"""
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    CATEGORIES = [
        ('lesson', 'Lesson'),
        ('practice', 'Practice'),
        ('quote', 'Quote'),
        ('poem', 'Poem'),
        ('news', 'News Article'),
        ('story', 'Story'),
        ('technical', 'Technical'),
        ('custom', 'Custom'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='beginner')
    category = models.CharField(max_length=20, choices=CATEGORIES, default='lesson')
    word_count = models.PositiveIntegerField()
    character_count = models.PositiveIntegerField()
    estimated_time = models.PositiveIntegerField(help_text="Estimated time in minutes")
    
    # Metadata
    author = models.CharField(max_length=100, blank=True)
    source = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    
    # School-specific content
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_texts')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'typing_texts'
        verbose_name = 'Typing Text'
        verbose_name_plural = 'Typing Texts'
        ordering = ['difficulty', 'title']
    
    def __str__(self):
        return f"{self.title} ({self.get_difficulty_display()})"
    
    def save(self, *args, **kwargs):
        # Auto-calculate word and character counts
        self.word_count = len(self.content.split())
        self.character_count = len(self.content)
        
        # Auto-calculate estimated time if not provided
        if not self.estimated_time:
            # Estimate 1 minute per 20 words for beginners
            self.estimated_time = max(1, self.word_count // 20)
        
        super().save(*args, **kwargs)


class TypingSession(models.Model):
    """Individual typing session record"""
    
    SESSION_TYPES = [
        ('lesson', 'Lesson'),
        ('practice', 'Practice'),
        ('test', 'Test'),
        ('challenge', 'Challenge'),
        ('voice', 'Voice Typing'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='typing_sessions')
    typing_text = models.ForeignKey(TypingText, on_delete=models.CASCADE, related_name='sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='practice')
    
    # Performance metrics
    words_per_minute = models.FloatField()
    accuracy = models.FloatField()
    words_typed = models.PositiveIntegerField()
    characters_typed = models.PositiveIntegerField()
    errors_made = models.PositiveIntegerField()
    time_taken = models.DurationField()
    
    # Detailed metrics
    correct_characters = models.PositiveIntegerField()
    incorrect_characters = models.PositiveIntegerField()
    backspaces_used = models.PositiveIntegerField(default=0)
    pauses_count = models.PositiveIntegerField(default=0)
    average_pause_duration = models.DurationField(null=True, blank=True)
    
    # Session details
    started_at = models.DateTimeField()
    completed_at = models.DateTimeField()
    is_completed = models.BooleanField(default=True)
    is_practice_mode = models.BooleanField(default=True)
    
    # Voice typing specific
    voice_accuracy = models.FloatField(null=True, blank=True)
    pronunciation_score = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'typing_sessions'
        verbose_name = 'Typing Session'
        verbose_name_plural = 'Typing Sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.typing_text.title} ({self.words_per_minute:.1f} WPM)"
    
    @property
    def error_rate(self):
        """Calculate error rate percentage"""
        if self.characters_typed == 0:
            return 0
        return (self.errors_made / self.characters_typed) * 100
    
    @property
    def session_duration_minutes(self):
        """Get session duration in minutes"""
        return self.time_taken.total_seconds() / 60


class TypingLesson(models.Model):
    """Structured typing lessons"""
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=TypingText.DIFFICULTY_LEVELS)
    order = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    
    # Lesson content
    instructions = models.TextField(blank=True)
    focus_keys = models.CharField(max_length=100, help_text="Keys to focus on (e.g., 'asdf', 'jkl;')")
    target_wpm = models.PositiveIntegerField(default=20)
    target_accuracy = models.PositiveIntegerField(default=90)
    
    # Prerequisites
    prerequisite_lessons = models.ManyToManyField('self', blank=True, symmetrical=False)
    
    # School-specific
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_lessons')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'typing_lessons'
        verbose_name = 'Typing Lesson'
        verbose_name_plural = 'Typing Lessons'
        ordering = ['difficulty', 'order']
        unique_together = ['difficulty', 'order']
    
    def __str__(self):
        return f"{self.title} (Level {self.order})"


class LessonText(models.Model):
    """Text content for specific lessons"""
    
    lesson = models.ForeignKey(TypingLesson, on_delete=models.CASCADE, related_name='texts')
    typing_text = models.ForeignKey(TypingText, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    is_required = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'lesson_texts'
        verbose_name = 'Lesson Text'
        verbose_name_plural = 'Lesson Texts'
        ordering = ['lesson', 'order']
        unique_together = ['lesson', 'order']
    
    def __str__(self):
        return f"{self.lesson.title} - {self.typing_text.title}"


class UserLessonProgress(models.Model):
    """Track user progress through lessons"""
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('mastered', 'Mastered'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(TypingLesson, on_delete=models.CASCADE, related_name='user_progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    # Progress metrics
    attempts = models.PositiveIntegerField(default=0)
    best_wpm = models.FloatField(default=0.0)
    best_accuracy = models.FloatField(default=0.0)
    time_spent = models.DurationField(default=timezone.timedelta(0))
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_attempted = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_lesson_progress'
        verbose_name = 'User Lesson Progress'
        verbose_name_plural = 'User Lesson Progress'
        unique_together = ['user', 'lesson']
    
    def __str__(self):
        return f"{self.user.email} - {self.lesson.title} ({self.get_status_display()})"


class TypingChallenge(models.Model):
    """Typing challenges and competitions"""
    
    CHALLENGE_TYPES = [
        ('speed', 'Speed Challenge'),
        ('accuracy', 'Accuracy Challenge'),
        ('endurance', 'Endurance Challenge'),
        ('custom', 'Custom Challenge'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    
    # Challenge parameters
    duration_minutes = models.PositiveIntegerField()
    target_wpm = models.PositiveIntegerField(null=True, blank=True)
    target_accuracy = models.PositiveIntegerField(null=True, blank=True)
    min_participants = models.PositiveIntegerField(default=1)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    
    # Timing
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    # Rewards
    points_reward = models.PositiveIntegerField(default=0)
    badge_reward = models.CharField(max_length=100, blank=True)
    
    # School-specific
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_challenges')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'typing_challenges'
        verbose_name = 'Typing Challenge'
        verbose_name_plural = 'Typing Challenges'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_challenge_type_display()})"
    
    @property
    def is_ongoing(self):
        """Check if challenge is currently active"""
        now = timezone.now()
        return self.is_active and self.start_date <= now <= self.end_date


class ChallengeParticipation(models.Model):
    """User participation in challenges"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='challenge_participations')
    challenge = models.ForeignKey(TypingChallenge, on_delete=models.CASCADE, related_name='participations')
    
    # Performance
    best_wpm = models.FloatField(default=0.0)
    best_accuracy = models.FloatField(default=0.0)
    total_sessions = models.PositiveIntegerField(default=0)
    total_time = models.DurationField(default=timezone.timedelta(0))
    
    # Ranking
    rank = models.PositiveIntegerField(null=True, blank=True)
    points_earned = models.PositiveIntegerField(default=0)
    
    # Timestamps
    joined_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'challenge_participations'
        verbose_name = 'Challenge Participation'
        verbose_name_plural = 'Challenge Participations'
        unique_together = ['user', 'challenge']
    
    def __str__(self):
        return f"{self.user.email} - {self.challenge.title}"