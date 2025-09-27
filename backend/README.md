# JFFT (Jackal Furious Finger Typing) Web App - Backend

A comprehensive Django REST API backend for the JFFT typing improvement platform.

## Features

- **User Management**: Custom user model with profiles, authentication, and social login
- **Typing Practice**: Structured lessons, practice sessions, and real-time feedback
- **Voice Typing**: Google Speech-to-Text integration for pronunciation practice
- **School Management**: Multi-tenant system for educational institutions
- **Analytics & Progress**: Comprehensive tracking and reporting
- **Gamification**: Achievements, leaderboards, and challenges
- **Certification**: Digital certificates and skill validation

## Tech Stack

- **Backend**: Django 4.2.7, Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Django Allauth with social login
- **Task Queue**: Celery with Redis
- **Voice Recognition**: Google Cloud Speech-to-Text API
- **File Storage**: Local/Cloud storage for media files

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jfft-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb jfft_db
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Populate initial data**
   ```bash
   python manage.py populate_initial_data
   ```

9. **Run development server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password

### Typing Practice
- `GET /api/typing/texts/` - List typing texts
- `GET /api/typing/texts/{id}/` - Get specific text
- `POST /api/typing/sessions/submit/` - Submit typing session
- `GET /api/typing/sessions/` - List user sessions
- `GET /api/typing/dashboard/` - Typing dashboard

### Voice Typing
- `GET /api/voice/exercises/` - List voice exercises
- `POST /api/voice/sessions/submit/` - Submit voice session
- `GET /api/voice/progress/` - Voice typing progress
- `GET /api/voice/pronunciation/` - Pronunciation guides
- `GET /api/voice/settings/` - Voice settings

### School Management
- `GET /api/schools/` - List schools
- `POST /api/schools/join/` - Join school
- `GET /api/schools/{id}/dashboard/` - School dashboard
- `GET /api/schools/assignments/` - List assignments
- `POST /api/schools/assignments/{id}/submit/` - Submit assignment

### Analytics
- `GET /api/analytics/dashboard/` - Analytics dashboard
- `GET /api/analytics/achievements/` - List achievements
- `GET /api/analytics/leaderboard/` - Leaderboards
- `GET /api/analytics/progress-report/` - Progress report
- `POST /api/analytics/track-event/` - Track events

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://username:password@localhost:5432/jfft_db
ALLOWED_HOSTS=localhost,127.0.0.1

# Google Cloud Speech API
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Redis for Celery
REDIS_URL=redis://localhost:6379/0

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Social Auth
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
```

### Google Cloud Speech API Setup

1. Create a Google Cloud project
2. Enable the Speech-to-Text API
3. Create a service account and download the JSON key
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable

## Running Celery

For production, run Celery workers:

```bash
# Start Celery worker
celery -A jfft_backend worker -l info

# Start Celery beat (for scheduled tasks)
celery -A jfft_backend beat -l info
```

## Testing

Run the test suite:

```bash
python manage.py test
```

## API Documentation

The API includes comprehensive documentation available at:
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Deployment

For production deployment:

1. Set `DEBUG=False` in environment
2. Configure proper database settings
3. Set up static file serving
4. Configure email settings
5. Set up Redis for Celery
6. Configure Google Cloud credentials
7. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@jackaltechltd.com or visit www.jackaltechltd.com