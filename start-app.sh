#!/bin/bash

# Start Full Stack Gym Management Application

echo "🏋️ Starting Gym Management System..."
echo ""

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend virtual environment not found!"
    echo "Please run setup-linux.sh first"
    exit 1
fi

# Check if frontend node_modules exist
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed!"
    echo "Please run: cd frontend && npm install"
    exit 1
fi

# Start MySQL if not running
echo "🗄️  Checking MySQL..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "Starting MySQL..."
    sudo systemctl start mysql
    sleep 2
fi

# Start Backend
echo "🔧 Starting Django Backend on port 8000..."
cd backend
source venv/bin/activate
python manage.py runserver 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start Frontend
echo "🎨 Starting Angular Frontend on port 4200..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/api/docs/"
echo ""
echo "Logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop the application:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or press Ctrl+C and run: pkill -f 'python manage.py runserver' && pkill -f 'ng serve'"
echo ""

# Save PIDs to file
echo "$BACKEND_PID" > .app.pid
echo "$FRONTEND_PID" >> .app.pid

echo "PIDs saved to .app.pid"
echo ""
echo "Press Ctrl+C to stop monitoring (apps will continue running)"
echo "To stop apps later, run: kill \$(cat .app.pid)"
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log 2>/dev/null
