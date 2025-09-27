from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class School(models.Model):
    """School/Institution model"""
    
    SCHOOL_TYPES = [
        ('elementary', 'Elementary School'),
        ('middle', 'Middle School'),
        ('high', 'High School'),
        ('college', 'College/University'),
        ('vocational', 'Vocational School'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    school_type = models.CharField(max_length=20, choices=SCHOOL_TYPES, default='other')
    description = models.TextField(blank=True)
    
    # Contact information
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    
    # Address
    address_line1 = models.CharField(max_length=200)
    address_line2 = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    
    # School details
    student_count = models.PositiveIntegerField(default=0)
    teacher_count = models.PositiveIntegerField(default=0)
    established_year = models.PositiveIntegerField(null=True, blank=True)
    
    # Subscription
    is_active = models.BooleanField(default=True)
    subscription_plan = models.CharField(max_length=50, default='basic')
    subscription_expires = models.DateTimeField(null=True, blank=True)
    max_students = models.PositiveIntegerField(default=100)
    max_teachers = models.PositiveIntegerField(default=10)
    
    # Admin
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='administered_schools')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'schools'
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def is_subscription_active(self):
        """Check if school subscription is active"""
        if not self.is_active:
            return False
        if self.subscription_expires and self.subscription_expires < timezone.now():
            return False
        return True
    
    @property
    def current_student_count(self):
        """Get current number of students"""
        return self.students.filter(is_active=True).count()
    
    @property
    def current_teacher_count(self):
        """Get current number of teachers"""
        return self.teachers.filter(is_active=True).count()


class SchoolClass(models.Model):
    """Class/Grade within a school"""
    
    GRADE_LEVELS = [
        ('K', 'Kindergarten'),
        ('1', '1st Grade'),
        ('2', '2nd Grade'),
        ('3', '3rd Grade'),
        ('4', '4th Grade'),
        ('5', '5th Grade'),
        ('6', '6th Grade'),
        ('7', '7th Grade'),
        ('8', '8th Grade'),
        ('9', '9th Grade'),
        ('10', '10th Grade'),
        ('11', '11th Grade'),
        ('12', '12th Grade'),
        ('college', 'College Level'),
        ('adult', 'Adult Education'),
    ]
    
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='classes')
    name = models.CharField(max_length=100)
    grade_level = models.CharField(max_length=10, choices=GRADE_LEVELS)
    description = models.TextField(blank=True)
    
    # Class settings
    max_students = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)
    
    # Teacher
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='taught_classes')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'school_classes'
        verbose_name = 'School Class'
        verbose_name_plural = 'School Classes'
        ordering = ['school', 'grade_level', 'name']
        unique_together = ['school', 'name']
    
    def __str__(self):
        return f"{self.school.name} - {self.name}"
    
    @property
    def current_student_count(self):
        """Get current number of students in class"""
        return self.students.filter(is_active=True).count()


class SchoolMembership(models.Model):
    """Membership of users in schools"""
    
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Administrator'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='school_memberships')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='memberships')
    school_class = models.ForeignKey(SchoolClass, on_delete=models.SET_NULL, null=True, blank=True, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Timestamps
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'school_memberships'
        verbose_name = 'School Membership'
        verbose_name_plural = 'School Memberships'
        unique_together = ['user', 'school']
    
    def __str__(self):
        return f"{self.user.email} - {self.school.name} ({self.get_role_display()})"


class SchoolAssignment(models.Model):
    """Assignments created by teachers for students"""
    
    ASSIGNMENT_TYPES = [
        ('lesson', 'Lesson'),
        ('practice', 'Practice'),
        ('test', 'Test'),
        ('challenge', 'Challenge'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    assignment_type = models.CharField(max_length=20, choices=ASSIGNMENT_TYPES)
    
    # Assignment details
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='assignments')
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='assignments')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_assignments')
    
    # Content
    typing_texts = models.ManyToManyField('typing_practice.TypingText', blank=True)
    lessons = models.ManyToManyField('typing_practice.TypingLesson', blank=True)
    challenges = models.ManyToManyField('typing_practice.TypingChallenge', blank=True)
    
    # Requirements
    target_wpm = models.PositiveIntegerField(null=True, blank=True)
    target_accuracy = models.PositiveIntegerField(null=True, blank=True)
    time_limit_minutes = models.PositiveIntegerField(null=True, blank=True)
    max_attempts = models.PositiveIntegerField(default=3)
    
    # Timing
    assigned_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'school_assignments'
        verbose_name = 'School Assignment'
        verbose_name_plural = 'School Assignments'
        ordering = ['-assigned_at']
    
    def __str__(self):
        return f"{self.title} - {self.school_class.name}"
    
    @property
    def is_overdue(self):
        """Check if assignment is overdue"""
        return timezone.now() > self.due_date


class AssignmentSubmission(models.Model):
    """Student submissions for assignments"""
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('late', 'Late'),
    ]
    
    assignment = models.ForeignKey(SchoolAssignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignment_submissions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    # Performance
    best_wpm = models.FloatField(default=0.0)
    best_accuracy = models.FloatField(default=0.0)
    attempts = models.PositiveIntegerField(default=0)
    time_spent = models.DurationField(default=timezone.timedelta(0))
    
    # Grading
    grade = models.FloatField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    graded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_submissions')
    graded_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'assignment_submissions'
        verbose_name = 'Assignment Submission'
        verbose_name_plural = 'Assignment Submissions'
        unique_together = ['assignment', 'student']
    
    def __str__(self):
        return f"{self.student.email} - {self.assignment.title}"
    
    @property
    def is_late(self):
        """Check if submission is late"""
        if not self.submitted_at:
            return timezone.now() > self.assignment.due_date
        return self.submitted_at > self.assignment.due_date


class SchoolReport(models.Model):
    """Reports and analytics for schools"""
    
    REPORT_TYPES = [
        ('class_performance', 'Class Performance'),
        ('student_progress', 'Student Progress'),
        ('teacher_activity', 'Teacher Activity'),
        ('assignment_summary', 'Assignment Summary'),
        ('custom', 'Custom Report'),
    ]
    
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Report data (JSON field for flexibility)
    data = models.JSONField(default=dict)
    
    # Filters
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, null=True, blank=True)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_reports')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'school_reports'
        verbose_name = 'School Report'
        verbose_name_plural = 'School Reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.school.name}"