from django.urls import path
from . import views

urlpatterns = [
    # Typing texts
    path('texts/', views.TypingTextView.as_view(), name='typing-texts'),
    path('texts/<int:pk>/', views.TypingTextDetailView.as_view(), name='typing-text-detail'),
    
    # Typing sessions
    path('sessions/', views.TypingSessionView.as_view(), name='typing-sessions'),
    path('sessions/submit/', views.submit_typing_session, name='submit-typing-session'),
    
    # Dashboard
    path('dashboard/', views.typing_dashboard, name='typing-dashboard'),
]