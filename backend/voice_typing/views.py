from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import (
    VoiceTypingSession, VoiceTypingExercise, VoiceTypingProgress,
    PronunciationGuide, VoiceTypingSettings
)
from .serializers import (
    VoiceTypingSessionSerializer, VoiceTypingExerciseSerializer,
    VoiceTypingProgressSerializer, PronunciationGuideSerializer,
    VoiceTypingSettingsSerializer
)


class VoiceTypingExerciseView(generics.ListAPIView):
    """List voice typing exercises"""
    serializer_class = VoiceTypingExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = VoiceTypingExercise.objects.filter(is_active=True)
        
        # Filter by difficulty if specified
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filter by language if specified
        language = self.request.query_params.get('language')
        if language:
            queryset = queryset.filter(language=language)
        
        # Filter premium content based on user subscription
        if not self.request.user.is_premium_active:
            queryset = queryset.filter(is_premium=False)
        
        return queryset.order_by('difficulty', 'order')


class VoiceTypingExerciseDetailView(generics.RetrieveAPIView):
    """Get specific voice typing exercise"""
    serializer_class = VoiceTypingExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VoiceTypingExercise.objects.filter(is_active=True)


class VoiceTypingSessionView(generics.ListCreateAPIView):
    """List and create voice typing sessions"""
    serializer_class = VoiceTypingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VoiceTypingSession.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_voice_session(request):
    """Submit a completed voice typing session"""
    data = request.data.copy()
    data['user'] = request.user.id
    
    serializer = VoiceTypingSessionSerializer(data=data)
    
    if serializer.is_valid():
        session = serializer.save()
        
        # Update user progress if exercise is specified
        exercise_id = request.data.get('exercise_id')
        if exercise_id:
            try:
                exercise = VoiceTypingExercise.objects.get(id=exercise_id)
                progress, created = VoiceTypingProgress.objects.get_or_create(
                    user=request.user,
                    exercise=exercise
                )
                progress.update_progress(
                    wpm=session.words_per_minute,
                    accuracy=session.accuracy,
                    pronunciation=session.pronunciation_score or 0.0
                )
            except VoiceTypingExercise.DoesNotExist:
                pass
        
        # Update user stats
        try:
            from analytics.models import UserStats
            stats, created = UserStats.objects.get_or_create(user=request.user)
            stats.voice_sessions += 1
            if session.pronunciation_score:
                stats.average_pronunciation = (
                    stats.average_pronunciation + session.pronunciation_score
                ) / 2
                if session.pronunciation_score > stats.best_pronunciation:
                    stats.best_pronunciation = session.pronunciation_score
            stats.save()
        except:
            pass
        
        return Response({
            'session': VoiceTypingSessionSerializer(session).data,
            'message': 'Voice session submitted successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VoiceTypingProgressView(generics.ListAPIView):
    """List user's voice typing progress"""
    serializer_class = VoiceTypingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VoiceTypingProgress.objects.filter(user=self.request.user)


class PronunciationGuideView(generics.ListAPIView):
    """List pronunciation guides"""
    serializer_class = PronunciationGuideSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PronunciationGuide.objects.filter(is_active=True)
        
        # Filter by language if specified
        language = self.request.query_params.get('language')
        if language:
            queryset = queryset.filter(language=language)
        
        # Filter by difficulty if specified
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
        
        return queryset.order_by('word')


class VoiceTypingSettingsView(generics.RetrieveUpdateAPIView):
    """Get and update voice typing settings"""
    serializer_class = VoiceTypingSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        settings, created = VoiceTypingSettings.objects.get_or_create(
            user=self.request.user
        )
        return settings


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def voice_typing_dashboard(request):
    """Get user's voice typing dashboard data"""
    user = request.user
    
    # Recent voice sessions
    recent_sessions = VoiceTypingSession.objects.filter(user=user)[:5]
    sessions_data = VoiceTypingSessionSerializer(recent_sessions, many=True).data
    
    # Voice progress
    progress = VoiceTypingProgress.objects.filter(user=user)[:5]
    progress_data = VoiceTypingProgressSerializer(progress, many=True).data
    
    # User voice stats
    try:
        from analytics.models import UserStats
        stats = UserStats.objects.get(user=user)
        voice_stats = {
            'voice_sessions': stats.voice_sessions,
            'average_pronunciation': stats.average_pronunciation,
            'best_pronunciation': stats.best_pronunciation,
        }
    except:
        voice_stats = {
            'voice_sessions': 0,
            'average_pronunciation': 0.0,
            'best_pronunciation': 0.0,
        }
    
    return Response({
        'recent_sessions': sessions_data,
        'progress': progress_data,
        'voice_stats': voice_stats
    })