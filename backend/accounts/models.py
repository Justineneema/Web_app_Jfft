from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Administrator'),
        ('individual', 'Individual User'),
    ]
    
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='individual')
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    is_premium = models.BooleanField(default=False)
    premium_expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Typing preferences
    preferred_theme = models.CharField(max_length=50, default='default')
    font_size = models.IntegerField(default=16)
    show_errors = models.BooleanField(default=True)
    sound_enabled = models.BooleanField(default=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.SET_NULL, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"
    
    @property
    def is_premium_active(self):
        """Check if user has active premium subscription"""
        if not self.is_premium:
            return False
        if self.premium_expires_at and self.premium_expires_at < timezone.now():
            return False
        return True
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()


class UserProfile(models.Model):
    """Extended user profile information"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Typing statistics
    total_typing_time = models.DurationField(default=timezone.timedelta(0))
    total_words_typed = models.PositiveIntegerField(default=0)
    average_wpm = models.FloatField(default=0.0)
    best_wpm = models.FloatField(default=0.0)
    average_accuracy = models.FloatField(default=0.0)
    best_accuracy = models.FloatField(default=0.0)
    
    # Learning progress
    current_level = models.CharField(max_length=20, default='beginner')
    lessons_completed = models.PositiveIntegerField(default=0)
    achievements_count = models.PositiveIntegerField(default=0)
    
    # Preferences
    difficulty_level = models.CharField(max_length=20, default='medium')
    practice_goal_daily = models.PositiveIntegerField(default=30)  # minutes
    practice_goal_weekly = models.PositiveIntegerField(default=180)  # minutes
    
    # Voice typing preferences
    voice_typing_enabled = models.BooleanField(default=False)
    preferred_language = models.CharField(max_length=10, default='en-US')
    voice_speed = models.FloatField(default=1.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.email} - Profile"
    
    def update_typing_stats(self, wpm, accuracy, words_typed, duration):
        """Update typing statistics after a session"""
        self.total_words_typed += words_typed
        self.total_typing_time += duration
        
        # Update averages
        if self.total_words_typed > 0:
            self.average_wpm = (self.average_wpm + wpm) / 2
            self.average_accuracy = (self.average_accuracy + accuracy) / 2
        
        # Update best scores
        if wpm > self.best_wpm:
            self.best_wpm = wpm
        if accuracy > self.best_accuracy:
            self.best_accuracy = accuracy
        
        self.save()
    
    def get_typing_level(self):
        """Determine typing level based on WPM and accuracy"""
        if self.best_wpm >= 60 and self.best_accuracy >= 95:
            return 'expert'
        elif self.best_wpm >= 40 and self.best_accuracy >= 90:
            return 'advanced'
        elif self.best_wpm >= 25 and self.best_accuracy >= 85:
            return 'intermediate'
        else:
            return 'beginner'