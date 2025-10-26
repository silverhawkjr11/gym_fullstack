#!/bin/bash
# Cross-platform database backup and restore scripts for Gym Fullstack

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}   Gym Fullstack DB Manager${NC}"
echo -e "${BLUE}==================================${NC}"
echo

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
}

# Function to check if MySQL container is running
check_mysql_container() {
    if ! docker ps | grep -q "gym_mysql"; then
        echo -e "${YELLOW}MySQL container is not running. Starting it...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Waiting for MySQL to be ready...${NC}"
        sleep 10
    fi
}

# Backup database
backup_db() {
    echo -e "${YELLOW}Creating database backup...${NC}"
    
    # Create backups directory if it doesn't exist
    mkdir -p backups
    
    # Generate timestamp for backup filename
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="backups/gymdb_backup_${TIMESTAMP}.sql"
    
    # Create backup
    docker exec gym_mysql mysqldump -u gym -pgym_pass gymdb > "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup created successfully: $BACKUP_FILE${NC}"
        echo -e "${BLUE}📁 Copy this file to your other machine to restore the database${NC}"
    else
        echo -e "${RED}❌ Backup failed${NC}"
        exit 1
    fi
}

# Restore database
restore_db() {
    echo -e "${YELLOW}Available backup files:${NC}"
    ls -la backups/*.sql 2>/dev/null || {
        echo -e "${RED}No backup files found in backups/ directory${NC}"
        exit 1
    }
    
    echo
    read -p "Enter the backup filename (or 'latest' for most recent): " BACKUP_FILE
    
    if [ "$BACKUP_FILE" = "latest" ]; then
        BACKUP_FILE=$(ls -t backups/*.sql | head -n1)
    elif [ ! -f "$BACKUP_FILE" ] && [ -f "backups/$BACKUP_FILE" ]; then
        BACKUP_FILE="backups/$BACKUP_FILE"
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}⚠️  WARNING: This will replace all existing data in the database!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" = "yes" ]; then
        echo -e "${YELLOW}Restoring database from: $BACKUP_FILE${NC}"
        
        # Drop and recreate database to ensure clean restore
        docker exec gym_mysql mysql -u root -proot_password_123 -e "DROP DATABASE IF EXISTS gymdb; CREATE DATABASE gymdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        
        # Restore the backup
        docker exec -i gym_mysql mysql -u gym -pgym_pass gymdb < "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database restored successfully!${NC}"
        else
            echo -e "${RED}❌ Restore failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}Restore cancelled${NC}"
    fi
}

# Sync to cloud (optional)
sync_to_cloud() {
    echo -e "${BLUE}Cloud sync options:${NC}"
    echo "1. Upload to GitHub (as release asset)"
    echo "2. Upload to Google Drive (requires rclone)"
    echo "3. Upload to Dropbox (requires dropbox-cli)"
    echo "4. Manual copy instructions"
    
    read -p "Choose an option (1-4): " CLOUD_OPTION
    
    case $CLOUD_OPTION in
        1)
            echo -e "${YELLOW}You can manually upload the backup to GitHub releases${NC}"
            echo -e "${BLUE}Latest backup: $(ls -t backups/*.sql | head -n1)${NC}"
            ;;
        4)
            echo -e "${BLUE}Manual copy instructions:${NC}"
            echo "1. Copy the backup file to your cloud storage (Google Drive, OneDrive, etc.)"
            echo "2. On your other machine, download the file to the backups/ directory"
            echo "3. Run this script and choose 'Restore database'"
            echo -e "${GREEN}Latest backup: $(ls -t backups/*.sql | head -n1)${NC}"
            ;;
        *)
            echo -e "${YELLOW}Option not implemented yet. Use manual copy for now.${NC}"
            ;;
    esac
}

# Main menu
show_menu() {
    echo "Choose an option:"
    echo "1. 🗄️  Backup database"
    echo "2. 📥 Restore database"
    echo "3. ☁️  Sync to cloud"
    echo "4. 🐳 Start MySQL container"
    echo "5. 🛑 Stop MySQL container"
    echo "6. 📊 Show container status"
    echo "7. 🔍 Connect to MySQL shell"
    echo "8. 🚀 Run Django migrations"
    echo "9. 👤 Create Django superuser"
    echo "10. ❌ Exit"
    echo
}

# Check prerequisites
check_docker

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-10): " choice
    
    case $choice in
        1)
            check_mysql_container
            backup_db
            ;;
        2)
            check_mysql_container
            restore_db
            ;;
        3)
            sync_to_cloud
            ;;
        4)
            echo -e "${YELLOW}Starting MySQL container...${NC}"
            docker-compose up -d
            echo -e "${GREEN}MySQL started on port 3307${NC}"
            ;;
        5)
            echo -e "${YELLOW}Stopping MySQL container...${NC}"
            docker-compose down
            echo -e "${GREEN}MySQL stopped${NC}"
            ;;
        6)
            echo -e "${BLUE}Container status:${NC}"
            docker-compose ps
            ;;
        7)
            echo -e "${YELLOW}Connecting to MySQL shell...${NC}"
            docker exec -it gym_mysql mysql -u gym -pgym_pass gymdb
            ;;
        8)
            echo -e "${YELLOW}Running Django migrations...${NC}"
            cd backend
            python manage.py migrate
            cd ..
            ;;
        9)
            echo -e "${YELLOW}Creating Django superuser...${NC}"
            cd backend
            python manage.py createsuperuser
            cd ..
            ;;
        10)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
    
    echo
    read -p "Press Enter to continue..."
    echo
done