@echo off
REM Database management script for Gym Fullstack

echo =================================
echo   Gym Fullstack Database Manager
echo =================================
echo.

:menu
echo Choose an option:
echo 1. Start MySQL (Docker)
echo 2. Stop MySQL (Docker)
echo 3. View MySQL logs
echo 4. Run Django migrations
echo 5. Create Django superuser
echo 6. Connect to MySQL shell
echo 7. Backup database
echo 8. Restore database
echo 9. Reset database (DANGER!)
echo 10. Exit
echo.

set /p choice="Enter your choice (1-10): "

if "%choice%"=="1" (
    echo Starting MySQL container...
    docker-compose up -d
    echo MySQL started on port 3307
    pause
    goto menu
)

if "%choice%"=="2" (
    echo Stopping MySQL container...
    docker-compose down
    echo MySQL stopped
    pause
    goto menu
)

if "%choice%"=="3" (
    echo Showing MySQL logs...
    docker-compose logs mysql
    pause
    goto menu
)

if "%choice%"=="4" (
    echo Running Django migrations...
    cd backend
    C:/my_workspace/gym_fullstack/backend/venv/Scripts/python.exe manage.py migrate
    cd ..
    pause
    goto menu
)

if "%choice%"=="5" (
    echo Creating Django superuser...
    cd backend
    C:/my_workspace/gym_fullstack/backend/venv/Scripts/python.exe manage.py createsuperuser
    cd ..
    pause
    goto menu
)

if "%choice%"=="6" (
    echo Connecting to MySQL shell...
    docker exec -it gym_mysql mysql -u gym -p
    pause
    goto menu
)

if "%choice%"=="7" (
    echo Creating database backup...
    if not exist "backups" mkdir backups
    set timestamp=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set timestamp=%timestamp: =0%
    set backupfile=backups\gymdb_backup_%timestamp%.sql
    docker exec gym_mysql mysqldump -u gym -pgym_pass gymdb > %backupfile%
    echo Backup created: %backupfile%
    echo Copy this file to your Linux laptop to restore there!
    pause
    goto menu
)

if "%choice%"=="8" (
    echo Available backup files:
    dir /b backups\*.sql 2>nul || echo No backup files found
    echo.
    set /p backupfile="Enter backup filename (from backups folder): "
    if not exist "backups\%backupfile%" (
        echo Backup file not found!
        pause
        goto menu
    )
    echo WARNING: This will replace all existing data!
    set /p confirm="Type 'YES' to confirm: "
    if "%confirm%"=="YES" (
        echo Restoring database...
        docker exec gym_mysql mysql -u root -proot_password_123 -e "DROP DATABASE IF EXISTS gymdb; CREATE DATABASE gymdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        docker exec -i gym_mysql mysql -u gym -pgym_pass gymdb < backups\%backupfile%
        echo Database restored!
    ) else (
        echo Restore cancelled
    )
    pause
    goto menu
)

if "%choice%"=="9" (
    echo WARNING: This will delete all data!
    set /p confirm="Type 'YES' to confirm: "
    if "%confirm%"=="YES" (
        docker-compose down -v
        docker volume rm gym_mysql_data
        echo Database reset complete
    ) else (
        echo Reset cancelled
    )
    pause
    goto menu
)

if "%choice%"=="10" (
    echo Goodbye!
    exit
)

echo Invalid choice. Please try again.
pause
goto menu