@echo off
REM Wiki System Setup Script for Windows
REM This script sets up the complete development environment

echo 🚀 Wiki System Setup
echo ====================
echo.

REM Check if we're in the right directory
if not exist "README.md" (
    echo ❌ Error: Please run this script from the project root directory
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check pnpm
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm...
    npm install -g pnpm
)

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    echo    Visit: https://www.docker.com/get-started
    pause
    exit /b 1
)

echo ✅ All dependencies found
echo.

REM 1. Setup environment files
echo 🔧 Setting up environment files...

if not exist "app\backend\.env" (
    copy "app\backend\.env.example" "app\backend\.env" >nul
    echo ✅ Created backend\.env
)

if not exist "app\frontend\.env" (
    copy "app\frontend\.env.example" "app\frontend\.env" >nul
    echo ✅ Created frontend\.env
)

if not exist "app\infra\.env" (
    copy "app\infra\.env.example" "app\infra\.env" >nul
    echo ✅ Created infra\.env
)

echo.

REM 2. Install backend dependencies
echo 📦 Installing backend dependencies...
cd app\backend
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..\..

REM 3. Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd app\frontend
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..\..

echo.

REM 4. Start PostgreSQL
echo 🐘 Starting PostgreSQL...
cd app\infra
docker compose -f docker-compose.dev.yml up -d postgres

REM Wait for PostgreSQL to be ready
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 15 /nobreak >nul

cd ..\..

REM 5. Setup database
echo 🗄️  Setting up database...
cd app\backend

REM Generate Prisma client
call pnpm prisma generate
echo ✅ Prisma client generated

REM Run migrations
call pnpm prisma migrate dev --name init
echo ✅ Database migrations applied

REM Seed database
call pnpm prisma db seed
echo ✅ Database seeded with demo data

cd ..\..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Demo Users Created:
echo    Admin:  admin@wiki.local  / admin123
echo    Editor: editor@wiki.local / editor123
echo    Viewer: viewer@wiki.local / viewer123
echo.
echo 🚀 To start the development environment:
echo    Open two terminals:
echo    1. cd app\backend ^&^& pnpm start:dev
echo    2. cd app\frontend ^&^& pnpm dev
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo    API Docs: http://localhost:3001/api
echo    pgAdmin: http://localhost:5050 (admin@wiki.local / admin123)
echo.
pause