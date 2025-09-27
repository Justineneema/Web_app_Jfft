from django.urls import path
from . import views

urlpatterns = [
    # Schools
    path('', views.SchoolView.as_view(), name='schools'),
    path('<int:pk>/', views.SchoolDetailView.as_view(), name='school-detail'),
    path('<int:school_id>/dashboard/', views.school_dashboard, name='school-dashboard'),
    
    # School classes
    path('classes/', views.SchoolClassView.as_view(), name='school-classes'),
    path('classes/<int:pk>/', views.SchoolClassDetailView.as_view(), name='school-class-detail'),
    
    # Memberships
    path('memberships/', views.SchoolMembershipView.as_view(), name='school-memberships'),
    path('join/', views.join_school, name='join-school'),
    
    # Assignments
    path('assignments/', views.SchoolAssignmentView.as_view(), name='school-assignments'),
    path('assignments/<int:pk>/', views.SchoolAssignmentDetailView.as_view(), name='school-assignment-detail'),
    path('assignments/<int:assignment_id>/submit/', views.submit_assignment, name='submit-assignment'),
    
    # Submissions
    path('submissions/', views.AssignmentSubmissionView.as_view(), name='assignment-submissions'),
]