# 🏋️ Gym Management System - Full Stack Application

A complete gym management system built with **Angular 19** frontend and **Django 5.2** backend with MySQL database.

## ✨ Features

- **User Authentication**: Login/Register with JWT tokens
- **Dashboard**: Real-time statistics and overview
- **Member Management**: Track memberships, contact info, and status
- **Trainer Management**: Manage trainer profiles and availability
- **Training Sessions**: Schedule and track training sessions
- **Role-Based Access**: Admin, Trainer, and Member roles
- **REST API**: Complete API with Swagger documentation

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd gym-management

# Run the setup script
chmod +x setup-linux.sh
./setup-linux.sh
```

### 2. Start the Application

```bash
# Start both frontend and backend
chmod +x start-app.sh
./start-app.sh
```

The application will be available at:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs/

### 3. Default Login

After running the setup, you can login with:
- **Username**: admin
- **Password**: admin123

## 📁 Project Structure

```
gym-management/
├── backend/              # Django REST API
│   ├── config/          # Django settings
│   ├── users/           # User management app
│   ├── training/        # Training sessions app
│   └── manage.py
├── frontend/            # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   ├── services/     # API services
│   │   │   ├── pages/        # Page components
│   │   │   │   ├── auth/     # Login/Register
│   │   │   │   └── dashboard/
│   │   │   └── app.ts
│   │   └── styles.scss
│   └── package.json
├── docker-compose.yml   # Docker configuration
├── start-app.sh        # Start both apps
└── setup-linux.sh      # Initial setup script
```

## 🔧 Manual Setup

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `POST /api/users/token/refresh/` - Refresh JWT token

### Members
- `GET /api/users/members/` - List all members
- `POST /api/users/members/` - Create member
- `GET /api/users/members/{id}/` - Get member details
- `PATCH /api/users/members/{id}/` - Update member
- `DELETE /api/users/members/{id}/` - Delete member

### Trainers
- `GET /api/users/trainers/` - List all trainers
- `POST /api/users/trainers/` - Create trainer
- `GET /api/users/trainers/{id}/` - Get trainer details
- `PATCH /api/users/trainers/{id}/` - Update trainer
- `DELETE /api/users/trainers/{id}/` - Delete trainer

### Training Sessions
- `GET /api/training/sessions/` - List all sessions
- `POST /api/training/sessions/` - Create session
- `GET /api/training/sessions/{id}/` - Get session details
- `PATCH /api/training/sessions/{id}/` - Update session
- `DELETE /api/training/sessions/{id}/` - Delete session

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with username/password
2. Backend returns access and refresh tokens
3. Frontend stores tokens in localStorage
4. All API requests include the access token in Authorization header
5. Token is automatically added via HTTP interceptor

## 🎨 Frontend Technologies

- **Angular 19**: Latest Angular with standalone components
- **Angular Material**: Material Design components
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe development
- **SCSS**: Modern styling

## 🔧 Backend Technologies

- **Django 5.2**: Python web framework
- **Django REST Framework**: API framework
- **MySQL**: Database
- **JWT Authentication**: Secure token-based auth
- **drf-spectacular**: OpenAPI 3.0 documentation

## 📊 Database Schema

### Users
- Custom user model with roles (admin, trainer, member)
- Fields: username, email, first_name, last_name, role, phone_number

### Members
- Links to User model
- Fields: membership_type, start/end dates, emergency contact

### Trainers
- Links to User model
- Fields: specialization, experience, bio, hourly_rate

### Training Sessions
- Links to Trainer and Member
- Fields: session_type, date, duration, status, price, notes

## 🐳 Docker Support

Run with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Django backend on port 8000
- Angular frontend on port 4200

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```
DB_NAME=gym_management
DB_USER=gym_admin
DB_PASSWORD=Gym@2025
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your-secret-key
DEBUG=True
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check logs
tail -f backend.log
```

### Frontend not starting
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Ensure backend CORS settings include frontend URL
- Check that backend is running on port 8000
- Verify API URL in frontend services

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation in `/docs` folder
- Review API docs at http://localhost:8000/api/docs/

---

Built with ❤️ using Angular and Django
