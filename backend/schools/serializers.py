from rest_framework import serializers
from .models import (
    School, SchoolClass, SchoolMembership, SchoolAssignment,
    AssignmentSubmission, SchoolReport
)


class SchoolSerializer(serializers.ModelSerializer):
    """School serializer"""
    
    admin_name = serializers.CharField(source='admin.get_full_name', read_only=True)
    is_subscription_active = serializers.ReadOnlyField()
    current_student_count = serializers.ReadOnlyField()
    current_teacher_count = serializers.ReadOnlyField()
    
    class Meta:
        model = School
        fields = [
            'id', 'name', 'school_type', 'description', 'email', 'phone',
            'website', 'address_line1', 'address_line2', 'city', 'state',
            'country', 'postal_code', 'student_count', 'teacher_count',
            'established_year', 'is_active', 'subscription_plan',
            'subscription_expires', 'max_students', 'max_teachers',
            'admin_name', 'is_subscription_active', 'current_student_count',
            'current_teacher_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SchoolClassSerializer(serializers.ModelSerializer):
    """School class serializer"""
    
    school_name = serializers.CharField(source='school.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    current_student_count = serializers.ReadOnlyField()
    
    class Meta:
        model = SchoolClass
        fields = [
            'id', 'school', 'school_name', 'name', 'grade_level',
            'description', 'max_students', 'is_active', 'teacher_name',
            'current_student_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SchoolMembershipSerializer(serializers.ModelSerializer):
    """School membership serializer"""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    
    class Meta:
        model = SchoolMembership
        fields = [
            'id', 'user', 'user_email', 'user_name', 'school', 'school_name',
            'school_class', 'class_name', 'role', 'is_active', 'is_verified',
            'joined_at', 'left_at'
        ]
        read_only_fields = ['id', 'joined_at', 'left_at']


class SchoolAssignmentSerializer(serializers.ModelSerializer):
    """School assignment serializer"""
    
    school_name = serializers.CharField(source='school.name', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = SchoolAssignment
        fields = [
            'id', 'title', 'description', 'assignment_type', 'school',
            'school_name', 'school_class', 'class_name', 'created_by',
            'created_by_name', 'target_wpm', 'target_accuracy',
            'time_limit_minutes', 'max_attempts', 'assigned_at', 'due_date',
            'is_active', 'is_overdue', 'created_at'
        ]
        read_only_fields = ['id', 'assigned_at', 'created_at']


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    """Assignment submission serializer"""
    
    student_email = serializers.CharField(source='student.email', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    graded_by_name = serializers.CharField(source='graded_by.get_full_name', read_only=True)
    is_late = serializers.ReadOnlyField()
    
    class Meta:
        model = AssignmentSubmission
        fields = [
            'id', 'assignment', 'assignment_title', 'student', 'student_email',
            'student_name', 'status', 'best_wpm', 'best_accuracy', 'attempts',
            'time_spent', 'grade', 'feedback', 'graded_by', 'graded_by_name',
            'graded_at', 'started_at', 'submitted_at', 'last_activity',
            'is_late', 'created_at'
        ]
        read_only_fields = ['id', 'last_activity', 'created_at']


class SchoolReportSerializer(serializers.ModelSerializer):
    """School report serializer"""
    
    school_name = serializers.CharField(source='school.name', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = SchoolReport
        fields = [
            'id', 'school', 'school_name', 'report_type', 'title',
            'description', 'data', 'start_date', 'end_date', 'school_class',
            'class_name', 'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']