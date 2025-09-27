from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from typing_practice.models import TypingText, TypingLesson, LessonText
from analytics.models import Achievement
from accounts.models import UserProfile

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate initial data for JFFT application'
    
    def handle(self, *args, **options):
        self.stdout.write('Starting to populate initial data...')
        
        # Create superuser if not exists
        self.create_superuser()
        
        # Create sample typing texts
        self.create_typing_texts()
        
        # Create sample lessons
        self.create_typing_lessons()
        
        # Create achievements
        self.create_achievements()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated initial data!')
        )
    
    def create_typing_texts(self):
        """Create sample typing texts"""
        self.stdout.write('Creating typing texts...')
        
        # Get the superuser
        admin_user = User.objects.filter(is_superuser=True).first()
        
        texts_data = [
            {
                'title': 'Basic Home Row',
                'content': 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
                'difficulty': 'beginner',
                'category': 'lesson',
                'author': 'JFFT Team',
                'is_premium': False,
            },
            {
                'title': 'Finger Stretching',
                'content': 'qwerty qwerty qwerty qwerty qwerty qwerty qwerty',
                'difficulty': 'beginner',
                'category': 'lesson',
                'author': 'JFFT Team',
                'is_premium': False,
            },
            {
                'title': 'Number Practice',
                'content': '1234567890 1234567890 1234567890 1234567890',
                'difficulty': 'intermediate',
                'category': 'lesson',
                'author': 'JFFT Team',
                'is_premium': False,
            },
            {
                'title': 'Symbol Practice',
                'content': '!@#$%^&*() !@#$%^&*() !@#$%^&*() !@#$%^&*()',
                'difficulty': 'intermediate',
                'category': 'lesson',
                'author': 'JFFT Team',
                'is_premium': False,
            },
            {
                'title': 'Speed Building',
                'content': 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
                'difficulty': 'advanced',
                'category': 'practice',
                'author': 'JFFT Team',
                'is_premium': False,
            },
            {
                'title': 'Programming Code',
                'content': 'def hello_world(): print("Hello, World!") if __name__ == "__main__": hello_world()',
                'difficulty': 'expert',
                'category': 'technical',
                'author': 'JFFT Team',
                'is_premium': True,
            },
        ]
        
        for text_data in texts_data:
            text_data['created_by'] = admin_user
            text, created = TypingText.objects.get_or_create(
                title=text_data['title'],
                defaults=text_data
            )
            if created:
                self.stdout.write(f'  Created: {text.title}')
    
    def create_typing_lessons(self):
        """Create sample typing lessons"""
        self.stdout.write('Creating typing lessons...')
        
        # Get the superuser
        admin_user = User.objects.filter(is_superuser=True).first()
        
        lessons_data = [
            {
                'title': 'Lesson 1: Home Row Basics',
                'description': 'Learn the home row keys: ASDF and JKL;',
                'difficulty': 'beginner',
                'order': 1,
                'instructions': 'Place your fingers on the home row keys and practice typing the letters.',
                'focus_keys': 'asdfjkl;',
                'target_wpm': 10,
                'target_accuracy': 90,
            },
            {
                'title': 'Lesson 2: Top Row',
                'description': 'Learn the top row keys: QWERTY and UIOP',
                'difficulty': 'beginner',
                'order': 2,
                'instructions': 'Practice typing the top row keys while maintaining home row position.',
                'focus_keys': 'qwertyuiop',
                'target_wpm': 15,
                'target_accuracy': 85,
            },
            {
                'title': 'Lesson 3: Bottom Row',
                'description': 'Learn the bottom row keys: ZXCV and M,./',
                'difficulty': 'beginner',
                'order': 3,
                'instructions': 'Practice typing the bottom row keys.',
                'focus_keys': 'zxcvbnm,./',
                'target_wpm': 20,
                'target_accuracy': 85,
            },
            {
                'title': 'Lesson 4: Numbers',
                'description': 'Learn to type numbers 0-9',
                'difficulty': 'intermediate',
                'order': 4,
                'instructions': 'Practice typing numbers using the number row.',
                'focus_keys': '1234567890',
                'target_wpm': 25,
                'target_accuracy': 90,
            },
            {
                'title': 'Lesson 5: Symbols',
                'description': 'Learn to type common symbols',
                'difficulty': 'intermediate',
                'order': 5,
                'instructions': 'Practice typing symbols and special characters.',
                'focus_keys': '!@#$%^&*()',
                'target_wpm': 30,
                'target_accuracy': 85,
            },
        ]
        
        for lesson_data in lessons_data:
            lesson_data['created_by'] = admin_user
            lesson, created = TypingLesson.objects.get_or_create(
                title=lesson_data['title'],
                defaults=lesson_data
            )
            if created:
                self.stdout.write(f'  Created: {lesson.title}')
    
    def create_achievements(self):
        """Create sample achievements"""
        self.stdout.write('Creating achievements...')
        
        achievements_data = [
            {
                'name': 'First Steps',
                'description': 'Complete your first typing session',
                'achievement_type': 'lesson',
                'rarity': 'common',
                'required_sessions': 1,
                'icon': 'trophy',
                'color': '#FFD700',
                'points': 10,
            },
            {
                'name': 'Speed Demon',
                'description': 'Achieve 60 WPM in a single session',
                'achievement_type': 'speed',
                'rarity': 'rare',
                'required_wpm': 60,
                'icon': 'lightning',
                'color': '#FF6B6B',
                'points': 50,
            },
            {
                'name': 'Accuracy Master',
                'description': 'Achieve 95% accuracy in a session',
                'achievement_type': 'accuracy',
                'rarity': 'rare',
                'required_accuracy': 95,
                'icon': 'target',
                'color': '#4ECDC4',
                'points': 50,
            },
            {
                'name': 'Dedicated Learner',
                'description': 'Complete 10 lessons',
                'achievement_type': 'lesson',
                'rarity': 'uncommon',
                'required_lessons': 10,
                'icon': 'book',
                'color': '#45B7D1',
                'points': 25,
            },
            {
                'name': 'Marathon Runner',
                'description': 'Complete 100 typing sessions',
                'achievement_type': 'endurance',
                'rarity': 'epic',
                'required_sessions': 100,
                'icon': 'medal',
                'color': '#96CEB4',
                'points': 100,
            },
        ]
        
        for achievement_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                name=achievement_data['name'],
                defaults=achievement_data
            )
            if created:
                self.stdout.write(f'  Created: {achievement.name}')
    
    def create_superuser(self):
        """Create superuser if not exists"""
        if not User.objects.filter(is_superuser=True).exists():
            self.stdout.write('Creating superuser...')
            User.objects.create_superuser(
                email='admin@jackaltechltd.com',
                username='admin',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write('  Created superuser: admin@jackaltechltd.com')
        else:
            self.stdout.write('  Superuser already exists')