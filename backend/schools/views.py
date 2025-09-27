from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import (
    School, SchoolClass, SchoolMembership, SchoolAssignment,
    AssignmentSubmission, SchoolReport
)
from .serializers import (
    SchoolSerializer, SchoolClassSerializer, SchoolMembershipSerializer,
    SchoolAssignmentSerializer, AssignmentSubmissionSerializer,
    SchoolReportSerializer
)


class SchoolView(generics.ListCreateAPIView):
    """List and create schools"""
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see schools they're members of or schools they created
        return School.objects.filter(
            Q(memberships__user=self.request.user) | Q(admin=self.request.user)
        ).distinct()


class SchoolDetailView(generics.RetrieveUpdateAPIView):
    """Get and update specific school"""
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return School.objects.filter(
            Q(memberships__user=self.request.user) | Q(admin=self.request.user)
        ).distinct()


class SchoolClassView(generics.ListCreateAPIView):
    """List and create school classes"""
    serializer_class = SchoolClassSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Filter by school if specified
        school_id = self.request.query_params.get('school')
        if school_id:
            return SchoolClass.objects.filter(school_id=school_id, is_active=True)
        return SchoolClass.objects.filter(is_active=True)


class SchoolClassDetailView(generics.RetrieveUpdateAPIView):
    """Get and update specific school class"""
    serializer_class = SchoolClassSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SchoolClass.objects.filter(is_active=True)


class SchoolMembershipView(generics.ListAPIView):
    """List school memberships"""
    serializer_class = SchoolMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SchoolMembership.objects.filter(user=self.request.user, is_active=True)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_school(request):
    """Join a school"""
    school_id = request.data.get('school_id')
    role = request.data.get('role', 'student')
    
    if not school_id:
        return Response({
            'error': 'School ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        school = School.objects.get(id=school_id, is_active=True)
    except School.DoesNotExist:
        return Response({
            'error': 'School not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is already a member
    if SchoolMembership.objects.filter(user=request.user, school=school).exists():
        return Response({
            'error': 'Already a member of this school'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create membership
    membership = SchoolMembership.objects.create(
        user=request.user,
        school=school,
        role=role
    )
    
    return Response({
        'membership': SchoolMembershipSerializer(membership).data,
        'message': 'Successfully joined school'
    })


class SchoolAssignmentView(generics.ListCreateAPIView):
    """List and create school assignments"""
    serializer_class = SchoolAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Teachers can see assignments they created
        # Students can see assignments for their classes
        if hasattr(self.request.user, 'school_memberships'):
            memberships = self.request.user.school_memberships.filter(is_active=True)
            if memberships.exists():
                school = memberships.first().school
                if memberships.first().role == 'teacher':
                    return SchoolAssignment.objects.filter(
                        school=school, is_active=True
                    )
                else:
                    # Student - show assignments for their classes
                    student_classes = SchoolClass.objects.filter(
                        memberships__user=self.request.user,
                        memberships__is_active=True
                    )
                    return SchoolAssignment.objects.filter(
                        school_class__in=student_classes, is_active=True
                    )
        return SchoolAssignment.objects.none()


class SchoolAssignmentDetailView(generics.RetrieveUpdateAPIView):
    """Get and update specific school assignment"""
    serializer_class = SchoolAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SchoolAssignment.objects.filter(is_active=True)


class AssignmentSubmissionView(generics.ListCreateAPIView):
    """List and create assignment submissions"""
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AssignmentSubmission.objects.filter(student=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_assignment(request, assignment_id):
    """Submit an assignment"""
    try:
        assignment = SchoolAssignment.objects.get(id=assignment_id, is_active=True)
    except SchoolAssignment.DoesNotExist:
        return Response({
            'error': 'Assignment not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is a student in the assignment's class
    if not SchoolMembership.objects.filter(
        user=request.user,
        school=assignment.school,
        role='student',
        is_active=True
    ).exists():
        return Response({
            'error': 'Not authorized to submit this assignment'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get or create submission
    submission, created = AssignmentSubmission.objects.get_or_create(
        assignment=assignment,
        student=request.user
    )
    
    if not created and submission.status == 'submitted':
        return Response({
            'error': 'Assignment already submitted'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update submission data
    submission.status = 'submitted'
    submission.submitted_at = timezone.now()
    submission.best_wpm = request.data.get('best_wpm', 0)
    submission.best_accuracy = request.data.get('best_accuracy', 0)
    submission.attempts = request.data.get('attempts', 1)
    submission.time_spent = request.data.get('time_spent', '00:00:00')
    submission.save()
    
    return Response({
        'submission': AssignmentSubmissionSerializer(submission).data,
        'message': 'Assignment submitted successfully'
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def school_dashboard(request, school_id):
    """Get school dashboard data"""
    try:
        school = School.objects.get(id=school_id)
    except School.DoesNotExist:
        return Response({
            'error': 'School not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user has access to this school
    if not SchoolMembership.objects.filter(
        user=request.user,
        school=school,
        is_active=True
    ).exists() and school.admin != request.user:
        return Response({
            'error': 'Not authorized to view this school'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get school data
    school_data = SchoolSerializer(school).data
    
    # Get classes
    classes = SchoolClass.objects.filter(school=school, is_active=True)
    classes_data = SchoolClassSerializer(classes, many=True).data
    
    # Get recent assignments
    recent_assignments = SchoolAssignment.objects.filter(
        school=school, is_active=True
    ).order_by('-assigned_at')[:5]
    assignments_data = SchoolAssignmentSerializer(recent_assignments, many=True).data
    
    # Get student count
    student_count = SchoolMembership.objects.filter(
        school=school, role='student', is_active=True
    ).count()
    
    # Get teacher count
    teacher_count = SchoolMembership.objects.filter(
        school=school, role='teacher', is_active=True
    ).count()
    
    return Response({
        'school': school_data,
        'classes': classes_data,
        'recent_assignments': assignments_data,
        'student_count': student_count,
        'teacher_count': teacher_count
    })