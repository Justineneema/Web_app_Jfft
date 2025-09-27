from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import (
    TypingText, TypingSession, TypingLesson, LessonText,
    UserLessonProgress, TypingChallenge, ChallengeParticipation
)
from .serializers import (
    TypingTextSerializer, TypingSessionSerializer, TypingSessionCreateSerializer,
    TypingLessonSerializer, LessonTextSerializer, UserLessonProgressSerializer,
    TypingChallengeSerializer, ChallengeParticipationSerializer,
    ChallengeParticipationCreateSerializer
)


class TypingTextView(generics.ListAPIView):
    """List typing texts with filtering"""
    serializer_class = TypingTextSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['difficulty', 'category', 'is_premium']
    search_fields = ['title', 'content', 'author']
    ordering_fields = ['title', 'difficulty', 'word_count', 'created_at']
    ordering = ['difficulty', 'title']
    
    def get_queryset(self):
        queryset = TypingText.objects.filter(is_active=True)
        
        # Filter by school if user is in a school
        if hasattr(self.request.user, 'school') and self.request.user.school:
            queryset = queryset.filter(
                Q(school=self.request.user.school) | Q(school__isnull=True)
            )
        else:
            queryset = queryset.filter(school__isnull=True)
        
        # Filter premium content based on user subscription
        if not self.request.user.is_premium_active:
            queryset = queryset.filter(is_premium=False)
        
        return queryset


class TypingTextDetailView(generics.RetrieveAPIView):
    """Get specific typing text"""
    serializer_class = TypingTextSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TypingText.objects.filter(is_active=True)


class TypingSessionView(generics.ListCreateAPIView):
    """List and create typing sessions"""
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['session_type', 'is_completed']
    ordering_fields = ['created_at', 'words_per_minute', 'accuracy']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TypingSessionCreateSerializer
        return TypingSessionSerializer
    
    def get_queryset(self):
        return TypingSession.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_typing_session(request):
    """Submit a completed typing session"""
    serializer = TypingSessionCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        session = serializer.save()
        
        # Update user profile stats
        try:
            from accounts.models import UserProfile
            profile = UserProfile.objects.get(user=request.user)
            profile.update_typing_stats(
                wpm=session.words_per_minute,
                accuracy=session.accuracy,
                words_typed=session.words_typed,
                duration=session.time_taken
            )
        except:
            pass
        
        return Response({
            'session': TypingSessionSerializer(session).data,
            'message': 'Session submitted successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def typing_dashboard(request):
    """Get user's typing dashboard data"""
    user = request.user
    
    # Recent sessions
    recent_sessions = TypingSession.objects.filter(user=user)[:5]
    sessions_data = TypingSessionSerializer(recent_sessions, many=True).data
    
    # User stats
    try:
        from analytics.models import UserStats
        stats = UserStats.objects.get(user=user)
        stats_data = {
            'total_sessions': stats.total_sessions,
            'average_wpm': stats.average_wpm,
            'best_wpm': stats.best_wpm,
            'average_accuracy': stats.average_accuracy,
            'current_level': stats.current_level,
            'current_streak': stats.current_streak,
        }
    except:
        stats_data = {
            'total_sessions': 0,
            'average_wpm': 0.0,
            'best_wpm': 0.0,
            'average_accuracy': 0.0,
            'current_level': 1,
            'current_streak': 0,
        }
    
    return Response({
        'recent_sessions': sessions_data,
        'stats': stats_data
    })