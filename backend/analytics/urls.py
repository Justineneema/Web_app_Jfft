from django.urls import path
from . import views

urlpatterns = [
    # Achievements
    path('achievements/', views.AchievementView.as_view(), name='achievements'),
    path('user-achievements/', views.UserAchievementView.as_view(), name='user-achievements'),
    
    # User stats
    path('stats/', views.UserStatsView.as_view(), name='user-stats'),
    
    # Dashboard
    path('dashboard/', views.analytics_dashboard, name='analytics-dashboard'),
    
    # Event tracking
    path('track-event/', views.track_event, name='track-event'),
    
    # Leaderboards
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    
    # Progress reports
    path('progress-report/', views.progress_report, name='progress-report'),
]