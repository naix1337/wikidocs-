#!/bin/bash

# 🚀 WikiDocs Quick Install - One-Liner Setup
# Schnelle Installation für erfahrene Benutzer

set -e

# Farben
G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'; NC='\033[0m'

echo -e "${G}🚀 WikiDocs Quick Install${NC}"
echo "Installing Node.js, pnpm, and WikiDocs..."

# OS Detection
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$ID
fi

# Update system & install dependencies
echo -e "${Y}[1/6]${NC} Updating system..."
if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
    sudo apt update -qq && sudo apt install -y curl wget git build-essential
elif [[ "$OS" == "centos" ]] || [[ "$OS" == "rhel" ]] || [[ "$OS" == "fedora" ]]; then
    if command -v dnf >/dev/null; then
        sudo dnf install -y curl wget git make gcc-c++
    else
        sudo yum install -y curl wget git make gcc-c++
    fi
fi

# Install Node.js 20
echo -e "${Y}[2/6]${NC} Installing Node.js 20..."
if ! command -v node >/dev/null || [[ $(node -v | cut -d. -f1 | sed 's/v//') -lt 18 ]]; then
    if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    elif [[ "$OS" == "centos" ]] || [[ "$OS" == "rhel" ]] || [[ "$OS" == "fedora" ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo dnf install -y nodejs 2>/dev/null || sudo yum install -y nodejs
    fi
fi

# Install pnpm
echo -e "${Y}[3/6]${NC} Installing pnpm..."
npm install -g pnpm

# Configure firewall
echo -e "${Y}[4/6]${NC} Configuring firewall..."
if command -v ufw >/dev/null; then
    sudo ufw allow 5173/tcp 2>/dev/null || true
    sudo ufw allow 3001/tcp 2>/dev/null || true
elif command -v firewall-cmd >/dev/null; then
    sudo firewall-cmd --permanent --add-port=5173/tcp 2>/dev/null || true
    sudo firewall-cmd --permanent --add-port=3001/tcp 2>/dev/null || true
    sudo firewall-cmd --reload 2>/dev/null || true
fi

# Clone and setup project
echo -e "${Y}[5/6]${NC} Setting up WikiDocs..."
PROJECT_DIR="$HOME/wikidocs"
[[ -d "$PROJECT_DIR" ]] && rm -rf "$PROJECT_DIR"
git clone https://github.com/naix1337/wikidocs-.git "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Install dependencies and setup database
echo -e "${Y}[6/6]${NC} Installing dependencies..."
[[ -f "package.json" ]] && pnpm install
cd app/frontend && pnpm install
cd ../backend && pnpm install && pnpm prisma generate && pnpm prisma db push && pnpm prisma db seed

# Get IP
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")

echo -e "${G}✅ Installation completed!${NC}"
echo -e "🌐 Access: http://localhost:5173 | http://$LOCAL_IP:5173"
echo -e "👤 Demo: admin@wiki.local / admin123"
echo -e "🚀 Start: cd $PROJECT_DIR && pnpm dev"

# Auto-start option
read -p "Start now? (Y/n): " -n 1 -r; echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    cd "$PROJECT_DIR"
    echo -e "${Y}Starting WikiDocs... (Press Ctrl+C to stop)${NC}"
    if [[ -f "package.json" ]] && pnpm list concurrently >/dev/null 2>&1; then
        pnpm dev
    else
        cd app/frontend && pnpm dev --host 0.0.0.0
    fi
fi