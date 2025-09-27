from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class VoiceTypingSession(models.Model):
    """Voice typing practice sessions"""
    
    LANGUAGES = [
        ('en-US', 'English (US)'),
        ('en-GB', 'English (UK)'),
        ('es-ES', 'Spanish (Spain)'),
        ('es-MX', 'Spanish (Mexico)'),
        ('fr-FR', 'French (France)'),
        ('de-DE', 'German'),
        ('it-IT', 'Italian'),
        ('pt-BR', 'Portuguese (Brazil)'),
        ('ja-JP', 'Japanese'),
        ('ko-KR', 'Korean'),
        ('zh-CN', 'Chinese (Simplified)'),
        ('zh-TW', 'Chinese (Traditional)'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='voice_sessions')
    language = models.CharField(max_length=10, choices=LANGUAGES, default='en-US')
    
    # Voice input
    audio_file = models.FileField(upload_to='voice_typing/audio/', null=True, blank=True)
    transcript = models.TextField()
    confidence_score = models.FloatField(help_text="Speech recognition confidence (0-1)")
    
    # Performance metrics
    words_spoken = models.PositiveIntegerField()
    words_per_minute = models.FloatField()
    accuracy = models.FloatField()
    pronunciation_score = models.FloatField(null=True, blank=True)
    
    # Error analysis
    mispronounced_words = models.JSONField(default=list, blank=True)
    unclear_segments = models.JSONField(default=list, blank=True)
    suggested_improvements = models.TextField(blank=True)
    
    # Session details
    duration = models.DurationField()
    started_at = models.DateTimeField()
    completed_at = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'voice_typing_sessions'
        verbose_name = 'Voice Typing Session'
        verbose_name_plural = 'Voice Typing Sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - Voice Session ({self.words_per_minute:.1f} WPM)"
    
    @property
    def is_high_confidence(self):
        """Check if confidence score is high"""
        return self.confidence_score >= 0.8
    
    @property
    def pronunciation_rating(self):
        """Get pronunciation rating based on score"""
        if not self.pronunciation_score:
            return 'N/A'
        if self.pronunciation_score >= 0.9:
            return 'Excellent'
        elif self.pronunciation_score >= 0.8:
            return 'Good'
        elif self.pronunciation_score >= 0.7:
            return 'Fair'
        else:
            return 'Needs Improvement'


class VoiceTypingExercise(models.Model):
    """Voice typing exercises and lessons"""
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='beginner')
    language = models.CharField(max_length=10, choices=VoiceTypingSession.LANGUAGES, default='en-US')
    
    # Exercise content
    text_to_speak = models.TextField()
    expected_words = models.JSONField(default=list, help_text="Expected words for pronunciation check")
    pronunciation_hints = models.TextField(blank=True)
    
    # Requirements
    target_wpm = models.PositiveIntegerField(default=20)
    target_accuracy = models.PositiveIntegerField(default=80)
    target_pronunciation = models.FloatField(default=0.8)
    time_limit_minutes = models.PositiveIntegerField(default=5)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=1)
    
    # School-specific
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_voice_exercises')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'voice_typing_exercises'
        verbose_name = 'Voice Typing Exercise'
        verbose_name_plural = 'Voice Typing Exercises'
        ordering = ['difficulty', 'order']
    
    def __str__(self):
        return f"{self.title} ({self.get_difficulty_display()})"


class VoiceTypingProgress(models.Model):
    """User progress in voice typing exercises"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='voice_progress')
    exercise = models.ForeignKey(VoiceTypingExercise, on_delete=models.CASCADE, related_name='user_progress')
    
    # Progress metrics
    attempts = models.PositiveIntegerField(default=0)
    best_wpm = models.FloatField(default=0.0)
    best_accuracy = models.FloatField(default=0.0)
    best_pronunciation = models.FloatField(default=0.0)
    total_time = models.DurationField(default=timezone.timedelta(0))
    
    # Completion status
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    mastery_level = models.CharField(max_length=20, default='not_started')
    
    # Timestamps
    started_at = models.DateTimeField(auto_now_add=True)
    last_attempted = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'voice_typing_progress'
        verbose_name = 'Voice Typing Progress'
        verbose_name_plural = 'Voice Typing Progress'
        unique_together = ['user', 'exercise']
    
    def __str__(self):
        return f"{self.user.email} - {self.exercise.title}"
    
    def update_progress(self, wpm, accuracy, pronunciation):
        """Update progress after completing an exercise"""
        self.attempts += 1
        
        if wpm > self.best_wpm:
            self.best_wpm = wpm
        if accuracy > self.best_accuracy:
            self.best_accuracy = accuracy
        if pronunciation > self.best_pronunciation:
            self.best_pronunciation = pronunciation
        
        # Check if exercise is completed
        if (wpm >= self.exercise.target_wpm and 
            accuracy >= self.exercise.target_accuracy and 
            pronunciation >= self.exercise.target_pronunciation):
            self.is_completed = True
            self.completed_at = timezone.now()
            self.mastery_level = 'mastered'
        
        self.save()


class PronunciationGuide(models.Model):
    """Pronunciation guides and tips"""
    
    word = models.CharField(max_length=100)
    language = models.CharField(max_length=10, choices=VoiceTypingSession.LANGUAGES, default='en-US')
    phonetic_spelling = models.CharField(max_length=200)
    audio_file = models.FileField(upload_to='voice_typing/pronunciation/', null=True, blank=True)
    
    # Pronunciation details
    difficulty_level = models.CharField(max_length=20, choices=VoiceTypingExercise.DIFFICULTY_LEVELS, default='beginner')
    common_mispronunciations = models.JSONField(default=list, blank=True)
    tips = models.TextField(blank=True)
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pronunciation_guides'
        verbose_name = 'Pronunciation Guide'
        verbose_name_plural = 'Pronunciation Guides'
        ordering = ['word']
        unique_together = ['word', 'language']
    
    def __str__(self):
        return f"{self.word} ({self.language})"


class VoiceTypingSettings(models.Model):
    """User-specific voice typing settings"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='voice_settings')
    
    # Language and voice
    preferred_language = models.CharField(max_length=10, choices=VoiceTypingSession.LANGUAGES, default='en-US')
    voice_speed = models.FloatField(default=1.0, help_text="Speech rate (0.5-2.0)")
    voice_pitch = models.FloatField(default=1.0, help_text="Voice pitch (0.5-2.0)")
    
    # Recognition settings
    auto_punctuation = models.BooleanField(default=True)
    profanity_filter = models.BooleanField(default=True)
    confidence_threshold = models.FloatField(default=0.7, help_text="Minimum confidence for recognition")
    
    # Feedback settings
    show_confidence_scores = models.BooleanField(default=True)
    show_pronunciation_hints = models.BooleanField(default=True)
    audio_feedback = models.BooleanField(default=True)
    
    # Practice settings
    practice_mode = models.BooleanField(default=True)
    repeat_exercises = models.BooleanField(default=False)
    adaptive_difficulty = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'voice_typing_settings'
        verbose_name = 'Voice Typing Settings'
        verbose_name_plural = 'Voice Typing Settings'
    
    def __str__(self):
        return f"{self.user.email} - Voice Settings"