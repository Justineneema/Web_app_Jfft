from django.contrib import admin
from .models import (
    School, SchoolClass, SchoolMembership, SchoolAssignment,
    AssignmentSubmission, SchoolReport
)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    """School admin"""
    
    list_display = ('name', 'school_type', 'email', 'is_active', 'subscription_plan', 'created_at')
    list_filter = ('school_type', 'is_active', 'subscription_plan', 'created_at')
    search_fields = ('name', 'email', 'city', 'state')
    readonly_fields = ('created_at', 'updated_at', 'current_student_count', 'current_teacher_count')
    
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'school_type', 'description')}),
        ('Contact', {'fields': ('email', 'phone', 'website')}),
        ('Address', {'fields': ('address_line1', 'address_line2', 'city', 'state', 'country', 'postal_code')}),
        ('Details', {'fields': ('student_count', 'teacher_count', 'established_year')}),
        ('Subscription', {'fields': ('is_active', 'subscription_plan', 'subscription_expires', 'max_students', 'max_teachers')}),
        ('Admin', {'fields': ('admin', 'created_at', 'updated_at')}),
    )


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    """School class admin"""
    
    list_display = ('name', 'school', 'grade_level', 'teacher', 'is_active', 'created_at')
    list_filter = ('grade_level', 'is_active', 'school', 'created_at')
    search_fields = ('name', 'school__name', 'teacher__email')
    readonly_fields = ('created_at', 'updated_at', 'current_student_count')


@admin.register(SchoolMembership)
class SchoolMembershipAdmin(admin.ModelAdmin):
    """School membership admin"""
    
    list_display = ('user', 'school', 'role', 'is_active', 'is_verified', 'joined_at')
    list_filter = ('role', 'is_active', 'is_verified', 'joined_at')
    search_fields = ('user__email', 'school__name')
    readonly_fields = ('joined_at', 'left_at')


@admin.register(SchoolAssignment)
class SchoolAssignmentAdmin(admin.ModelAdmin):
    """School assignment admin"""
    
    list_display = ('title', 'school', 'school_class', 'assignment_type', 'due_date', 'is_active', 'assigned_at')
    list_filter = ('assignment_type', 'is_active', 'school', 'assigned_at')
    search_fields = ('title', 'school__name', 'school_class__name')
    readonly_fields = ('assigned_at', 'created_at')
    filter_horizontal = ('typing_texts', 'lessons', 'challenges')


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    """Assignment submission admin"""
    
    list_display = ('student', 'assignment', 'status', 'best_wpm', 'best_accuracy', 'submitted_at', 'is_late')
    list_filter = ('status', 'assignment__school', 'submitted_at')
    search_fields = ('student__email', 'assignment__title')
    readonly_fields = ('submitted_at', 'last_activity', 'created_at')


@admin.register(SchoolReport)
class SchoolReportAdmin(admin.ModelAdmin):
    """School report admin"""
    
    list_display = ('title', 'school', 'report_type', 'start_date', 'end_date', 'created_at')
    list_filter = ('report_type', 'school', 'created_at')
    search_fields = ('title', 'school__name')
    readonly_fields = ('created_at',)