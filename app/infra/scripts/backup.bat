@echo off
REM Wiki System Backup Script for Windows
REM This script creates a complete backup of the PostgreSQL database and uploaded files

setlocal enabledelayedexpansion

REM Configuration
set BACKUP_DIR=backups
set DB_CONTAINER=wiki-postgres
set DB_NAME=wiki
set DB_USER=wiki
set UPLOADS_DIR=uploads
set RETENTION_DAYS=30

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generate timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "MIN=%dt:~10,2%" & set "SS=%dt:~12,2%"
set TIMESTAMP=%YYYY%%MM%%DD%_%HH%%MIN%%SS%
set BACKUP_NAME=wiki_backup_%TIMESTAMP%

echo 🔄 Starting backup: %BACKUP_NAME%

REM 1. Database backup
echo 📊 Backing up database...
docker exec %DB_CONTAINER% pg_dump -U %DB_USER% -d %DB_NAME% --no-owner --no-privileges > "%BACKUP_DIR%\%BACKUP_NAME%.sql"

if %errorlevel% equ 0 (
    echo ✅ Database backup completed
) else (
    echo ❌ Database backup failed
    exit /b 1
)

REM 2. Uploads backup (if directory exists)
if exist "%UPLOADS_DIR%" (
    echo 📁 Backing up uploads...
    powershell -Command "Compress-Archive -Path '%UPLOADS_DIR%\*' -DestinationPath '%BACKUP_DIR%\%BACKUP_NAME%_uploads.zip' -Force"
    
    if !errorlevel! equ 0 (
        echo ✅ Uploads backup completed
    ) else (
        echo ❌ Uploads backup failed
        exit /b 1
    )
) else (
    echo ⚠️  Uploads directory not found, skipping...
)

REM 3. Create metadata file
echo 📋 Creating backup metadata...
(
echo {
echo   "backup_name": "%BACKUP_NAME%",
echo   "timestamp": "%TIMESTAMP%",
echo   "database": "%DB_NAME%",
echo   "database_file": "%BACKUP_NAME%.sql",
echo   "uploads_file": "%BACKUP_NAME%_uploads.zip",
echo   "created_at": "%date:~10,4%-%date:~4,2%-%date:~7,2%T%time:~0,8%Z",
echo   "version": "1.0"
echo }
) > "%BACKUP_DIR%\%BACKUP_NAME%_metadata.json"

REM 4. Show backup summary
echo.
echo 🎉 Backup completed successfully!
echo 📂 Backup location: %BACKUP_DIR%
echo 📄 Database: %BACKUP_NAME%.sql
if exist "%UPLOADS_DIR%" echo 📁 Uploads: %BACKUP_NAME%_uploads.zip
echo 📋 Metadata: %BACKUP_NAME%_metadata.json

echo.
echo To restore this backup, run:
echo   restore.bat %BACKUP_NAME%

pause