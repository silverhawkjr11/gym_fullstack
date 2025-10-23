# 🌐 Cross-Platform Development Guide

Working between Windows (work) and Linux (home) with the same database.

## 🎯 **Quick Start Workflow**

### On Windows (Work Laptop):
1. Work on your project
2. Before leaving: **Backup database**
   ```bash
   # Run db-manager.bat and choose option 7
   .\db-manager.bat
   ```
3. Copy the backup file to cloud storage (OneDrive, Google Drive, GitHub, etc.)

### On Linux (Home Laptop):
1. Download the backup file to `backups/` folder
2. **Restore database**
   ```bash
   # Make script executable (first time only)
   chmod +x db-manager.sh
   
   # Run the manager and choose option 2
   ./db-manager.sh
   ```
3. Continue working!

---

## 🔄 **Detailed Cross-Platform Workflow**

### **Method 1: Database Backup/Restore (Recommended)**

#### ✅ **Advantages:**
- ✅ Works reliably across different platforms
- ✅ Small file sizes (SQL dumps)
- ✅ Easy to version control (optional)
- ✅ Can sync through any cloud service
- ✅ No Docker registry needed

#### 📱 **Step-by-Step:**

**On Windows:**
```bash
# 1. Create backup
.\db-manager.bat
# Choose option 7 (Backup database)

# 2. Upload to cloud (manual)
# Copy backups\gymdb_backup_YYYYMMDD_HHMMSS.sql to:
# - OneDrive/Google Drive/Dropbox
# - GitHub (as release or commit)
# - USB drive
# - Email to yourself
```

**On Linux:**
```bash
# 1. Download backup file to backups/ folder
mkdir -p backups
# Place your backup file here

# 2. Restore database
chmod +x db-manager.sh
./db-manager.sh
# Choose option 2 (Restore database)

# 3. Run migrations (if needed)
cd backend
python manage.py migrate
```

---

### **Method 2: Docker Volume Sync (Advanced)**

#### ⚠️ **Note:** More complex but keeps everything in sync

```bash
# Export Docker volume to tar file
docker run --rm -v gym_mysql_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mysql_data_backup.tar.gz -C /data .

# On other machine, import volume
docker run --rm -v gym_mysql_data:/data -v $(pwd):/backup ubuntu tar xzf /backup/mysql_data_backup.tar.gz -C /data
```

---

### **Method 3: Git-Based Backup (For Small Datasets)**

Add database backups to your Git repository:

```bash
# .gitignore (exclude large backups)
backups/gymdb_backup_*.sql
!backups/latest.sql  # Only track latest backup

# Before committing
cp backups/gymdb_backup_20251023_143052.sql backups/latest.sql
git add backups/latest.sql
git commit -m "Update database backup"
git push
```

---

## 🐳 **Docker Setup on Both Machines**

### **Windows Setup:**
```bash
# Install Docker Desktop for Windows
# Start the container
docker-compose up -d

# Verify
docker ps | findstr gym_mysql
```

### **Linux Setup:**
```bash
# Install Docker and Docker Compose
sudo apt update
sudo apt install docker.io docker-compose

# Start the container  
docker-compose up -d

# Verify
docker ps | grep gym_mysql
```

---

## 📁 **File Organization**

```
gym_fullstack/
├── docker-compose.yml          # Same on both machines
├── db-manager.bat             # Windows script
├── db-manager.sh              # Linux script  
├── backups/                   # Database backup files
│   ├── gymdb_backup_20251023_143052.sql
│   ├── gymdb_backup_20251023_180321.sql
│   └── latest.sql            # Optional: latest backup for Git
├── backend/
│   ├── config/settings.py    # Same database config
│   └── ...
└── DATABASE_SETUP.md
```

---

## 🔧 **Environment-Specific Settings**

### **Option 1: Environment Variables (Recommended)**

Create `.env` files for each machine:

**Windows (.env.windows):**
```bash
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=gymdb
DB_USER=gym
DB_PASSWORD=gym_pass
```

**Linux (.env.linux):**
```bash
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=gymdb
DB_USER=gym
DB_PASSWORD=gym_pass
```

### **Option 2: Settings Override**

Create platform-specific settings files:

```python
# settings_local.py (not in Git)
from .settings import *

# Override any settings for local development
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.100']
```

---

## 🚀 **Quick Commands Reference**

### **Windows:**
```batch
# Start everything
.\db-manager.bat

# Quick backup
docker exec gym_mysql mysqldump -u gym -pgym_pass gymdb > backup.sql

# Quick restore  
docker exec -i gym_mysql mysql -u gym -pgym_pass gymdb < backup.sql
```

### **Linux:**
```bash
# Start everything
./db-manager.sh

# Quick backup
docker exec gym_mysql mysqldump -u gym -pgym_pass gymdb > backup.sql

# Quick restore
docker exec -i gym_mysql mysql -u gym -pgym_pass gymdb < backup.sql
```

---

## 💡 **Pro Tips**

1. **Automate Backups:** Set up scheduled backups before you leave work
2. **Cloud Sync:** Use OneDrive/Google Drive for automatic sync
3. **Git Integration:** Store latest backup in Git for version control
4. **Naming Convention:** Use timestamp in backup filenames
5. **Test Restore:** Always test restore process on both machines

---

## 🐛 **Troubleshooting**

### **Container Won't Start:**
```bash
# Check if port is in use
netstat -tulpn | grep 3307  # Linux
netstat -an | findstr :3307  # Windows

# Use different port if needed
# Edit docker-compose.yml: "3308:3306"
# Edit settings.py: PORT = "3308"
```

### **Backup/Restore Fails:**
```bash
# Check container is running
docker ps | grep gym_mysql

# Check MySQL is ready
docker logs gym_mysql

# Manual connection test
docker exec -it gym_mysql mysql -u gym -pgym_pass -e "SHOW DATABASES;"
```

### **Permission Issues (Linux):**
```bash
# Fix file permissions
chmod +x db-manager.sh
sudo chown -R $USER:$USER backups/
```

This setup gives you complete flexibility to work seamlessly between your Windows work laptop and Linux home laptop! 🎉