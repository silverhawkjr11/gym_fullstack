#!/bin/bash
# Quick setup script for Linux laptop

echo "🐧 Setting up Gym Fullstack on Linux..."

# Make scripts executable
chmod +x db-manager.sh

# Create necessary directories
mkdir -p backups
mkdir -p backend/logs

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing Docker..."
    sudo apt update
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "✅ Docker installed. Please log out and log back in for group changes to take effect."
else
    echo "✅ Docker found"
fi

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo "✅ Python environment ready"
else
    echo "✅ Python environment found"
fi

# Check if we need to restore a database
if [ -n "$(ls -A backups/*.sql 2>/dev/null)" ]; then
    echo "📁 Found database backup files:"
    ls -la backups/*.sql
    echo
    read -p "Would you like to restore a database backup now? (y/n): " restore_choice
    if [ "$restore_choice" = "y" ] || [ "$restore_choice" = "Y" ]; then
        ./db-manager.sh
    fi
else
    echo "📁 No backup files found. Starting fresh database..."
    docker-compose up -d
    echo "⏳ Waiting for MySQL to be ready..."
    sleep 10
    cd backend
    source venv/bin/activate
    python manage.py migrate
    echo "👤 Create a superuser account:"
    python manage.py createsuperuser
    cd ..
fi

echo
echo "🎉 Setup complete!"
echo
echo "Quick commands:"
echo "  Start database:  docker-compose up -d"
echo "  Stop database:   docker-compose down"
echo "  Run server:      cd backend && source venv/bin/activate && python manage.py runserver"
echo "  Manage DB:       ./db-manager.sh"
echo
echo "Your database is running on port 3307 (separate from any work MySQL on 3306)"