from django.urls import path
from . import views

urlpatterns = [
    # Voice typing exercises
    path('exercises/', views.VoiceTypingExerciseView.as_view(), name='voice-exercises'),
    path('exercises/<int:pk>/', views.VoiceTypingExerciseDetailView.as_view(), name='voice-exercise-detail'),
    
    # Voice typing sessions
    path('sessions/', views.VoiceTypingSessionView.as_view(), name='voice-sessions'),
    path('sessions/submit/', views.submit_voice_session, name='submit-voice-session'),
    
    # Progress tracking
    path('progress/', views.VoiceTypingProgressView.as_view(), name='voice-progress'),
    
    # Pronunciation guides
    path('pronunciation/', views.PronunciationGuideView.as_view(), name='pronunciation-guides'),
    
    # Settings
    path('settings/', views.VoiceTypingSettingsView.as_view(), name='voice-settings'),
    
    # Dashboard
    path('dashboard/', views.voice_typing_dashboard, name='voice-dashboard'),
]