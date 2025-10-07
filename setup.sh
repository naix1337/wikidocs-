#!/bin/bash

# Wiki System Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Wiki System Setup"
echo "===================="
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check dependencies
echo "🔍 Checking dependencies..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ All dependencies found"
echo ""

# 1. Setup environment files
echo "🔧 Setting up environment files..."

# Backend environment
if [ ! -f "app/backend/.env" ]; then
    cp app/backend/.env.example app/backend/.env
    echo "✅ Created backend/.env"
fi

# Frontend environment
if [ ! -f "app/frontend/.env" ]; then
    cp app/frontend/.env.example app/frontend/.env
    echo "✅ Created frontend/.env"
fi

# Infrastructure environment
if [ ! -f "app/infra/.env" ]; then
    cp app/infra/.env.example app/infra/.env
    echo "✅ Created infra/.env"
fi

echo ""

# 2. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd app/backend
pnpm install
echo "✅ Backend dependencies installed"
cd ../..

# 3. Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd app/frontend
pnpm install
echo "✅ Frontend dependencies installed"
cd ../..

echo ""

# 4. Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
cd app/infra
docker compose -f docker-compose.dev.yml up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
for i in {1..30}; do
    if docker exec wiki-postgres-dev pg_isready -U wiki -d wiki > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL failed to start"
        exit 1
    fi
    sleep 2
done

cd ../..

# 5. Setup database
echo "🗄️  Setting up database..."
cd app/backend

# Generate Prisma client
pnpm prisma generate
echo "✅ Prisma client generated"

# Run migrations
pnpm prisma migrate dev --name init
echo "✅ Database migrations applied"

# Seed database
pnpm prisma db seed
echo "✅ Database seeded with demo data"

cd ../..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Demo Users Created:"
echo "   Admin:  admin@wiki.local  / admin123"
echo "   Editor: editor@wiki.local / editor123"
echo "   Viewer: viewer@wiki.local / viewer123"
echo ""
echo "🚀 To start the development environment:"
echo "   make dev"
echo ""
echo "   Or manually:"
echo "   cd app/backend && pnpm start:dev"
echo "   cd app/frontend && pnpm dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api"
echo "   pgAdmin: http://localhost:5050 (admin@wiki.local / admin123)"
echo ""