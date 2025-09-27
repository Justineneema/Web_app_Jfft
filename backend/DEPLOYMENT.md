# JFFT Backend - Deployment Guide

## 🚀 Quick Start

### 1. Upload to Repository
```bash
# Upload the entire folder to your Git repository
git init
git add .
git commit -m "Initial JFFT backend implementation"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Local Development Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python manage.py populate_initial_data

# Start development server
python manage.py runserver
```

### 3. Production Deployment

#### Option A: Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn jfft_backend.wsgi" > Procfile

# Deploy
git add .
git commit -m "Add Procfile for Heroku"
git push heroku main
```

#### Option B: DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically

#### Option C: AWS/GCP/Azure
1. Create a virtual machine or container
2. Install Python, PostgreSQL, Redis
3. Clone repository and follow local setup
4. Configure web server (Nginx + Gunicorn)

### 4. Environment Variables (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:port/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Google Cloud Speech API
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Redis for Celery
REDIS_URL=redis://localhost:6379/0

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 5. Database Setup (Production)
```bash
# For PostgreSQL
createdb jfft_production
python manage.py migrate
python manage.py collectstatic
```

### 6. Admin Access
- URL: `https://yourdomain.com/admin/`
- Username: `admin@jackaltechltd.com`
- Password: `admin123` (change in production!)

## 📁 Repository Structure
```
jfft-backend/
├── accounts/              # User management
├── analytics/             # Progress tracking
├── schools/               # School management
├── typing_practice/       # Core typing features
├── voice_typing/          # Voice typing features
├── jfft_backend/          # Django settings
├── manage.py              # Django management
├── requirements.txt       # Dependencies
├── README.md              # Documentation
├── .gitignore            # Git ignore rules
└── env.example           # Environment template
```

## 🔧 API Endpoints
- Authentication: `/api/auth/`
- Typing Practice: `/api/typing/`
- Voice Typing: `/api/voice/`
- School Management: `/api/schools/`
- Analytics: `/api/analytics/`

## 📞 Support
- Email: info@jackaltechltd.com
- Website: www.jackaltechltd.com
