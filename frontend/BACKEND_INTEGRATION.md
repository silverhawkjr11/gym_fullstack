# Backend Integration Guide

This guide explains how to connect the Angular frontend to your Django backend.

## Backend API Endpoints

Based on your Django backend structure, the following endpoints are available:

### Base URL
Development: `http://localhost:8000/api/`

### User Management
- `POST /users/register/` - Register new user
- `POST /users/login/` - User login
- `POST /users/logout/` - User logout
- `GET /users/profile/` - Get user profile

### Training/Classes Management
- `GET /training/classes/` - List all classes
- `POST /training/classes/` - Create new class
- `GET /training/classes/{id}/` - Get class details
- `PUT /training/classes/{id}/` - Update class
- `DELETE /training/classes/{id}/` - Delete class

## Setting Up Services

### 1. Create Environment Configuration

Create `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

Create `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-domain.com/api'
};
```

### 2. Create API Service

Generate the service:
```bash
ng generate service services/api
```

Update `src/app/services/api.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Token ${token}` : ''
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }
}
```

### 3. Create Member Service Example

Generate the service:
```bash
ng generate service services/member
```

Update `src/app/services/member.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membership_type: string;
  join_date: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(private api: ApiService) {}

  getMembers(): Observable<Member[]> {
    return this.api.get<Member[]>('members/');
  }

  getMember(id: number): Observable<Member> {
    return this.api.get<Member>(`members/${id}/`);
  }

  createMember(member: Partial<Member>): Observable<Member> {
    return this.api.post<Member>('members/', member);
  }

  updateMember(id: number, member: Partial<Member>): Observable<Member> {
    return this.api.put<Member>(`members/${id}/`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.api.delete<void>(`members/${id}/`);
  }
}
```

### 4. Update Dashboard to Use Real Data

Update `src/app/pages/dashboard/dashboard.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalMembers = 0;
  totalTrainers = 0;
  totalClasses = 0;
  todayAttendance = 0;

  recentMembers: any[] = [];
  upcomingClasses: any[] = [];

  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load members
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.totalMembers = members.length;
        this.recentMembers = members.slice(0, 5); // Get last 5 members
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });

    // Load other data similarly
    // this.classService.getClasses().subscribe(...)
    // this.attendanceService.getTodayAttendance().subscribe(...)
  }
}
```

## CORS Configuration

Make sure your Django backend allows requests from the Angular frontend.

In your Django `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

# Allow requests from Angular dev server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

# Or for development, allow all origins (NOT for production!)
CORS_ALLOW_ALL_ORIGINS = True
```

Install django-cors-headers if not already installed:
```bash
pip install django-cors-headers
```

## Authentication Integration

### 1. Create Auth Service

```bash
ng generate service services/auth
```

`src/app/services/auth.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login/`, {
      username,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/logout/`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
```

### 2. Create Auth Guard

```bash
ng generate guard guards/auth
```

`src/app/guards/auth.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### 3. Protect Routes

Update `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'members', loadComponent: () => import('./pages/members/members').then(m => m.Members) },
      // ... other routes
    ]
  }
];
```

## Testing the Connection

1. Start your Django backend:
```bash
cd backend
python manage.py runserver
```

2. Start your Angular frontend:
```bash
cd frontend
ng serve
```

3. Open browser console to check for:
   - Network requests to `http://localhost:8000/api/`
   - Any CORS errors
   - Authentication token in localStorage

## Error Handling

Add a global error interceptor:

```bash
ng generate interceptor interceptors/error
```

`src/app/interceptors/error.interceptor.ts`:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }
      
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
```

Register in `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(withInterceptors([errorInterceptor]))
  ]
};
```

## Next Steps

1. Create login page component
2. Implement member management CRUD operations
3. Add form validation
4. Implement real-time updates with WebSockets (if needed)
5. Add loading spinners and error messages
6. Implement pagination for large datasets

Happy coding! 🚀
