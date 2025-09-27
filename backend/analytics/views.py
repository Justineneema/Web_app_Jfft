from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Avg, Max, Count, Sum
from datetime import timedelta
from .models import Achievement, UserAchievement, UserStats, DailyStreak, AnalyticsEvent
from .serializers import (
    AchievementSerializer, UserAchievementSerializer, UserStatsSerializer,
    DailyStreakSerializer, AnalyticsEventSerializer
)


class AchievementView(generics.ListAPIView):
    """List achievements"""
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Achievement.objects.filter(is_active=True)
        
        # Filter by type if specified
        achievement_type = self.request.query_params.get('type')
        if achievement_type:
            queryset = queryset.filter(achievement_type=achievement_type)
        
        # Filter by rarity if specified
        rarity = self.request.query_params.get('rarity')
        if rarity:
            queryset = queryset.filter(rarity=rarity)
        
        return queryset.order_by('rarity', 'order')


class UserAchievementView(generics.ListAPIView):
    """List user's achievements"""
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)


class UserStatsView(generics.RetrieveAPIView):
    """Get user statistics"""
    serializer_class = UserStatsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        stats, created = UserStats.objects.get_or_create(user=self.request.user)
        return stats


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_dashboard(request):
    """Get user's analytics dashboard data"""
    user = request.user
    
    # Get or create user stats
    stats, created = UserStats.objects.get_or_create(user=user)
    
    # Get recent achievements
    recent_achievements = UserAchievement.objects.filter(
        user=user, is_earned=True
    ).order_by('-earned_at')[:5]
    achievements_data = UserAchievementSerializer(recent_achievements, many=True).data
    
    # Get daily streaks
    recent_streaks = DailyStreak.objects.filter(user=user).order_by('-date')[:7]
    streaks_data = DailyStreakSerializer(recent_streaks, many=True).data
    
    # Get recent analytics events
    recent_events = AnalyticsEvent.objects.filter(user=user).order_by('-timestamp')[:10]
    events_data = AnalyticsEventSerializer(recent_events, many=True).data
    
    # Calculate weekly progress
    week_ago = timezone.now() - timedelta(days=7)
    weekly_sessions = stats.total_sessions
    if hasattr(user, 'typing_sessions'):
        weekly_sessions = user.typing_sessions.filter(created_at__gte=week_ago).count()
    
    # Get typing level
    typing_level = 'beginner'
    if stats.best_wpm >= 60 and stats.best_accuracy >= 95:
        typing_level = 'expert'
    elif stats.best_wpm >= 40 and stats.best_accuracy >= 90:
        typing_level = 'advanced'
    elif stats.best_wpm >= 25 and stats.best_accuracy >= 85:
        typing_level = 'intermediate'
    
    return Response({
        'stats': UserStatsSerializer(stats).data,
        'recent_achievements': achievements_data,
        'recent_streaks': streaks_data,
        'recent_events': events_data,
        'weekly_sessions': weekly_sessions,
        'typing_level': typing_level
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def track_event(request):
    """Track an analytics event"""
    event_type = request.data.get('event_type')
    data = request.data.get('data', {})
    
    if not event_type:
        return Response({
            'error': 'Event type is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create analytics event
    event = AnalyticsEvent.objects.create(
        user=request.user,
        event_type=event_type,
        data=data,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        referrer=request.META.get('HTTP_REFERER', '')
    )
    
    return Response({
        'event': AnalyticsEventSerializer(event).data,
        'message': 'Event tracked successfully'
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def leaderboard(request):
    """Get leaderboard data"""
    leaderboard_type = request.query_params.get('type', 'global')
    metric_type = request.query_params.get('metric', 'wpm')
    limit = int(request.query_params.get('limit', 10))
    
    # Get user's school for school leaderboard
    school = None
    if leaderboard_type == 'school' and hasattr(request.user, 'school'):
        school = request.user.school
    
    # Build queryset based on metric type
    if metric_type == 'wpm':
        from typing_practice.models import TypingSession
        queryset = TypingSession.objects.filter(is_completed=True)
        if school:
            queryset = queryset.filter(user__school=school)
        
        # Get average WPM per user
        from django.db.models import Avg
        user_stats = queryset.values('user__email', 'user__first_name', 'user__last_name').annotate(
            avg_wpm=Avg('words_per_minute'),
            total_sessions=Count('id')
        ).order_by('-avg_wpm')[:limit]
        
        leaderboard_data = []
        for i, stat in enumerate(user_stats, 1):
            leaderboard_data.append({
                'rank': i,
                'user_email': stat['user__email'],
                'user_name': f"{stat['user__first_name']} {stat['user__last_name']}",
                'score': round(stat['avg_wpm'], 1),
                'total_sessions': stat['total_sessions']
            })
    
    elif metric_type == 'accuracy':
        from typing_practice.models import TypingSession
        queryset = TypingSession.objects.filter(is_completed=True)
        if school:
            queryset = queryset.filter(user__school=school)
        
        user_stats = queryset.values('user__email', 'user__first_name', 'user__last_name').annotate(
            avg_accuracy=Avg('accuracy'),
            total_sessions=Count('id')
        ).order_by('-avg_accuracy')[:limit]
        
        leaderboard_data = []
        for i, stat in enumerate(user_stats, 1):
            leaderboard_data.append({
                'rank': i,
                'user_email': stat['user__email'],
                'user_name': f"{stat['user__first_name']} {stat['user__last_name']}",
                'score': round(stat['avg_accuracy'], 1),
                'total_sessions': stat['total_sessions']
            })
    
    else:
        # Default to user stats
        queryset = UserStats.objects.all()
        if school:
            queryset = queryset.filter(user__school=school)
        
        if metric_type == 'sessions':
            queryset = queryset.order_by('-total_sessions')
        elif metric_type == 'points':
            queryset = queryset.order_by('-total_points')
        else:
            queryset = queryset.order_by('-best_wpm')
        
        leaderboard_data = []
        for i, stat in enumerate(queryset[:limit], 1):
            score = getattr(stat, metric_type, 0)
            leaderboard_data.append({
                'rank': i,
                'user_email': stat.user.email,
                'user_name': stat.user.get_full_name(),
                'score': score,
                'total_sessions': stat.total_sessions
            })
    
    return Response({
        'leaderboard': leaderboard_data,
        'type': leaderboard_type,
        'metric': metric_type
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def progress_report(request):
    """Get user's progress report"""
    user = request.user
    days = int(request.query_params.get('days', 30))
    
    # Get date range
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    # Get user stats
    stats, created = UserStats.objects.get_or_create(user=user)
    
    # Get sessions in date range
    from typing_practice.models import TypingSession
    sessions = TypingSession.objects.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lte=end_date
    )
    
    # Calculate metrics
    total_sessions = sessions.count()
    total_time = sum((s.time_taken for s in sessions), timedelta())
    avg_wpm = sessions.aggregate(avg_wpm=Avg('words_per_minute'))['avg_wpm'] or 0
    avg_accuracy = sessions.aggregate(avg_accuracy=Avg('accuracy'))['avg_accuracy'] or 0
    best_wpm = sessions.aggregate(best_wpm=Max('words_per_minute'))['best_wpm'] or 0
    best_accuracy = sessions.aggregate(best_accuracy=Max('accuracy'))['best_accuracy'] or 0
    
    # Get daily activity
    daily_activity = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        day_sessions = sessions.filter(created_at__date=date.date())
        daily_activity.append({
            'date': date.date(),
            'sessions': day_sessions.count(),
            'total_time': sum((s.time_taken for s in day_sessions), timedelta()),
            'avg_wpm': day_sessions.aggregate(avg_wpm=Avg('words_per_minute'))['avg_wpm'] or 0,
            'avg_accuracy': day_sessions.aggregate(avg_accuracy=Avg('accuracy'))['avg_accuracy'] or 0
        })
    
    return Response({
        'period_days': days,
        'total_sessions': total_sessions,
        'total_time': total_time,
        'average_wpm': round(avg_wpm, 1),
        'average_accuracy': round(avg_accuracy, 1),
        'best_wpm': round(best_wpm, 1),
        'best_accuracy': round(best_accuracy, 1),
        'daily_activity': daily_activity,
        'current_level': stats.current_level,
        'total_points': stats.total_points,
        'current_streak': stats.current_streak
    })