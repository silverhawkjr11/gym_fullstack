# 🏋️ Gym Management System - Testing Instructions

## Current Status

✅ **Backend**: Django REST API fully implemented and working
✅ **Frontend**: Angular 19 application fully implemented
✅ **Integration**: Frontend connected to backend with API services
✅ **Authentication**: JWT auth with login/register pages
✅ **All Changes Committed**: Ready to test!

## How to Test the Full Application

### Step 1: Start the Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

Keep this terminal open. You should see:
```
Django version 5.2.5, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
```

### Step 2: Start the Frontend (New Terminal)

```bash
cd frontend
npm start
```

Keep this terminal open. You should see:
```
Angular Live Development Server is listening on localhost:4200
```

### Step 3: Access the Application

Open your browser and go to: **http://localhost:4200**

You'll be redirected to the login page.

### Step 4: Create an Account

1. Click "Register here" on the login page
2. Fill in the registration form:
   - First Name: Your first name
   - Last Name: Your last name
   - Username: Choose a username
   - Email: Your email
   - Password: At least 6 characters
   - Role: Select "Member", "Trainer", or "Admin"
3. Click "Register"

You'll be automatically logged in and redirected to the dashboard!

### Step 5: Explore the Dashboard

The dashboard displays:
- **Total Members**: Count of all members
- **Total Trainers**: Count of all trainers
- **Active Sessions**: Count of training sessions
- **Completed Today**: Sessions completed today
- **Recent Members**: List of newest members
- **Upcoming Sessions**: Scheduled training sessions

### Step 6: Test the API Directly

You can also test the API endpoints:

**Get All Members:**
```bash
curl http://localhost:8000/api/users/members/
```

**Get All Trainers:**
```bash
curl http://localhost:8000/api/users/trainers/
```

**Get All Sessions:**
```bash
curl http://localhost:8000/api/training/sessions/
```

**API Documentation:**
Open http://localhost:8000/api/docs/ in your browser for interactive API docs!

## Quick Start Script

Alternatively, use the automated script:

```bash
chmod +x start-app.sh
./start-app.sh
```

This will start both backend and frontend automatically!

## Features Implemented

### Frontend
- ✅ Login page with form validation
- ✅ Register page with role selection
- ✅ Dashboard with real-time data
- ✅ JWT authentication with interceptor
- ✅ API services for all endpoints
- ✅ TypeScript models
- ✅ Material Design UI
- ✅ Responsive design

### Backend
- ✅ User authentication with JWT
- ✅ Member management API
- ✅ Trainer management API
- ✅ Training session API
- ✅ Role-based access
- ✅ CORS configured for frontend
- ✅ API documentation with Swagger
- ✅ MySQL database

### Integration
- ✅ Frontend calls backend API
- ✅ JWT tokens stored in localStorage
- ✅ Automatic auth header injection
- ✅ Login/logout flow working
- ✅ Dashboard fetches real data
- ✅ Error handling

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:

**For Backend (port 8000):**
```bash
lsof -ti:8000 | xargs kill -9
```

**For Frontend (port 4200):**
```bash
lsof -ti:4200 | xargs kill -9
```

### Cannot Connect to Backend
1. Make sure backend is running on port 8000
2. Check MySQL is running: `sudo systemctl status mysql`
3. Verify CORS settings in `backend/config/settings.py`

### Frontend Build Errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Default Test Data

After registration, you can:
1. Create members via the API or Django admin
2. Create trainers via the API or Django admin
3. Create training sessions
4. View them all in the dashboard

## API Testing Tools

**Postman Collection**: Available in `backend/postman_collection.json`
**Swagger UI**: http://localhost:8000/api/docs/
**Django Admin**: http://localhost:8000/admin/

## Next Steps

The full application is now working! You can:
1. Add more member management features
2. Create trainer profile pages
3. Implement session booking
4. Add payment processing
5. Build reports and analytics
6. Add notifications
7. Implement attendance tracking

## Support

- Check logs in `backend.log` and `frontend.log`
- Review API documentation at http://localhost:8000/api/docs/
- Check browser console for frontend errors
- Review Django terminal for backend errors

---

🎉 **Congratulations!** Your full-stack gym management system is ready!
