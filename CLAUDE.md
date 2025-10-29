# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack gym management system with an **Angular 20** frontend and **Django 5.2** backend, using MySQL database. The system manages users (admin/trainer/trainee roles), training sessions, member profiles, and trainer profiles.

## Technology Stack

**Backend:**
- Django 5.2 with Django REST Framework
- MySQL 8.0 (via PyMySQL)
- JWT authentication (djangorestframework-simplejwt)
- drf-spectacular for OpenAPI 3.0 docs

**Frontend:**
- Angular 20 with standalone components
- Angular Material for UI
- RxJS for reactive patterns
- TypeScript 5.9

## Development Commands

### Start the Application
```bash
# Start both frontend and backend
./start-app.sh

# Backend only (port 8000)
cd backend
source venv/bin/activate
python manage.py runserver 8000

# Frontend only (port 4200)
cd frontend
npm start
```

### Database Management
```bash
cd backend
source venv/bin/activate

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Reset database
python manage.py flush
```

### Testing
```bash
# Backend tests (uses SQLite in-memory for speed)
cd backend
source venv/bin/activate
python manage.py test

# Run specific test
python manage.py test users.tests.UserModelTest

# Frontend tests
cd frontend
npm test
```

### Build and Deploy
```bash
# Backend: No build step needed, runs directly
# Frontend: Production build
cd frontend
ng build --configuration production
```

## Architecture

### Backend Structure

The backend uses Django's app-based architecture with two main apps:

**users app** - Handles authentication and user profiles:
- Custom User model with roles (ADMIN, TRAINER, TRAINEE)
- TrainerProfile and MemberProfile models (1:1 with User)
- JWT-based authentication via `/api/auth/token/`
- User registration auto-logs in after successful registration

**training app** - Manages gym operations:
- Student, Lesson, Payment models (legacy structure)
- TrainingSession model (newer structure linking TrainerProfile and MemberProfile)
- Note: The app has both legacy models (Student/Lesson/Payment) and newer models (TrainingSession) - be aware of this duality

**Key Backend Patterns:**
- Uses PyMySQL instead of mysqlclient (configured in settings.py via `pymysql.install_as_MySQLdb()`)
- Custom permission classes control access by role (IsAdminOrTrainerReadOwn, IsTrainer)
- ViewSets filter querysets based on user role - trainers see only their data, admins see everything
- Tests use SQLite in-memory database (see settings.py lines 99-106)
- CORS configured for common frontend dev ports (4200, 3000, 5173, 8080)

### Frontend Structure

**Standalone Components Architecture** (Angular 19+):
- No NgModules - uses standalone components throughout
- Functional route configuration in `app.routes.ts`
- HTTP interceptor pattern for JWT token injection

**Key Frontend Patterns:**
- Services use RxJS BehaviorSubject for state management
- AuthService stores tokens in localStorage and maintains currentUser$ observable
- authInterceptor (functional) automatically adds Bearer token to requests
- Services communicate with backend at `http://localhost:8000/api`
- Models mirror backend serializers for type safety
- **Pagination:** Backend uses PageNumberPagination returning `{count, next, previous, results}`. Frontend services use RxJS `map` to extract `results` array from paginated responses

**File Organization:**
```
frontend/src/app/
├── models/          # TypeScript interfaces matching backend models
├── services/        # API services and HTTP interceptors
├── pages/           # Page components (auth, dashboard)
├── app.config.ts    # Application providers and configuration
└── app.routes.ts    # Route definitions
```

### Authentication Flow

1. User POSTs credentials to `/api/users/login/`
2. Backend returns JWT access + refresh tokens plus user object
3. Frontend stores tokens in localStorage and user in BehaviorSubject
4. authInterceptor adds `Authorization: Bearer {token}` to all requests
5. Backend validates JWT on protected endpoints

**Important:** The registration endpoint at `/api/users/register/` creates a user and returns user data, but does NOT auto-login. After registration, frontend must call `/api/users/login/` separately.

### API Endpoints

**Authentication:**
- `POST /api/users/register/` - Register (public)
- `POST /api/users/login/` - Login with username/password (public)
- `POST /api/auth/token/refresh/` - Refresh JWT
- `GET /api/me` - Get current user info (authenticated)

**User Management:**
- `GET/POST /api/users/members/` - Member profiles (requires auth)
- `GET/PATCH/DELETE /api/users/members/{id}/` - Single member
- `GET/POST /api/users/trainers/` - Trainer profiles
- `GET/PATCH/DELETE /api/users/trainers/{id}/` - Single trainer

**Training:**
- `GET/POST /api/training/sessions/` - Training sessions
- `GET/PATCH/DELETE /api/training/sessions/{id}/` - Single session
- `/api/training/students/`, `/api/training/lessons/`, `/api/training/payments/` - Legacy endpoints

**Documentation:**
- `/api/swagger/` - Swagger UI
- `/api/redoc/` - ReDoc UI
- `/api/schema/` - OpenAPI schema

### Database Notes

**Development Database:**
- MySQL on port 3306 (local) or 3307 (Docker)
- Database: `gymdb`
- User: `gym` / Password: `gym_pass`

**Database Relationships:**
- User (custom model extending AbstractUser)
  - Has role field (ADMIN/TRAINER/TRAINEE)
  - Can have trainer FK (trainees assigned to trainer)
- TrainerProfile (1:1 with User where role=TRAINER)
- MemberProfile (1:1 with User where role=TRAINEE)
- TrainingSession (FK to TrainerProfile and MemberProfile)

**Important:** When creating users programmatically, set the role field. When creating trainer/member profiles, ensure the linked user has the correct role.

### Port Configuration

The backend runs on **port 8000** (not 8001 despite old commit messages). This was changed back to avoid confusion. The MySQL printer conflict mentioned in commits is resolved by using local MySQL on 3306 or Docker MySQL on 3307.

### Common Development Tasks

**Adding a new API endpoint:**
1. Create/update model in `models.py`
2. Create serializer in `serializers.py`
3. Create view/viewset in `views.py`
4. Register in `urls.py` (use router for viewsets)
5. Run migrations if model changed

**Adding a new frontend page:**
1. Create component in `frontend/src/app/pages/`
2. Add route to `app.routes.ts`
3. Create service if new API calls needed - remember to handle paginated responses:
   ```typescript
   import { map } from 'rxjs/operators';
   import { PaginatedResponse } from '../models/pagination.model';

   getItems(): Observable<Item[]> {
     return this.http.get<PaginatedResponse<Item>>(`${this.apiUrl}/items/`)
       .pipe(map(response => response.results));
   }
   ```
4. Define TypeScript interfaces in `models/`

**Debugging authentication issues:**
- Check localStorage for `access_token`, `refresh_token`, `currentUser`
- Verify authInterceptor is adding Authorization header
- Check Django REST Framework auth classes in settings.py
- Review CORS configuration if getting CORS errors

### Testing Considerations

- Backend tests use SQLite in-memory (automatic via settings.py)
- No need to configure test database separately
- Tests run faster due to in-memory DB
- Frontend uses Jasmine/Karma (standard Angular setup)
