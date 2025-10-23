# Gym Fullstack - Database Setup Guide

This guide helps you set up MySQL for your side project without interfering with your work MySQL installation.

> 🌐 **Working across Windows & Linux?** See [CROSS_PLATFORM_GUIDE.md](./CROSS_PLATFORM_GUIDE.md) for seamless development between machines!

## 🐳 Option 1: Docker MySQL (Recommended)

### Prerequisites
- Docker Desktop installed on your Windows laptop
- Docker running

### Setup Steps

1. **Start the MySQL container:**
   ```bash
   # From the root directory (where docker-compose.yml is located)
   docker-compose up -d
   ```

2. **Verify the container is running:**
   ```bash
   docker ps
   ```
   You should see `gym_mysql` container running.

3. **Run Django migrations:**
   ```bash
   cd backend
   python manage.py migrate
   ```

4. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

### Managing the Database

- **Start database:** `docker-compose up -d`
- **Stop database:** `docker-compose down`
- **View logs:** `docker-compose logs mysql`
- **Connect to MySQL:** 
  ```bash
  docker exec -it gym_mysql mysql -u gym -p
  # Password: gym_pass
  ```

### Database Connection Details
- **Host:** 127.0.0.1
- **Port:** 3307 (NOT 3306 - this avoids conflict with work MySQL)
- **Database:** gymdb
- **Username:** gym
- **Password:** gym_pass

---

## 📦 Option 2: Portable MySQL (Alternative)

If you prefer not to use Docker:

1. Download MySQL ZIP Archive (not installer) from MySQL website
2. Extract to a folder like `C:\mysql-portable`
3. Configure `my.cnf` to use port 3307
4. Start MySQL manually when needed

---

## 💡 Option 3: SQLite for Quick Development

For quick development without MySQL setup, you can temporarily use SQLite by changing `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

---

## 🔧 Troubleshooting

**Port already in use:**
- Change port in `docker-compose.yml` from 3307 to another port (e.g., 3308)
- Update `settings.py` accordingly

**Docker not starting:**
- Ensure Docker Desktop is running
- Check if ports are available: `netstat -an | findstr :3307`

**Connection refused:**
- Wait a few seconds after `docker-compose up` for MySQL to fully start
- Check container status: `docker-compose ps`