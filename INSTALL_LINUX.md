# 🐧 Linux Installation Guide - WikiDocs

Komplette Anleitung zur Installation des WikiDocs-Systems auf Linux-Distributionen.

## 📋 System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04+, Debian 11+, CentOS 8+, oder ähnliche Linux-Distribution
- **RAM**: 2GB (4GB empfohlen)
- **Storage**: 5GB freier Speicherplatz
- **CPU**: 2 Cores (empfohlen)
- **Network**: Internetverbindung für Downloads

### Empfohlene Spezifikationen
- **RAM**: 8GB+
- **Storage**: 20GB+ SSD
- **CPU**: 4+ Cores
- **OS**: Ubuntu 22.04 LTS oder Debian 12

## 🔧 Dependencies Installation

### 1. System Update (Ubuntu/Debian)
```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Basis-Tools installieren
sudo apt install -y curl wget git build-essential
```

### 2. Node.js 18+ Installation
```bash
# NodeSource Repository hinzufügen
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js installieren
sudo apt install -y nodejs

# Version prüfen
node --version  # sollte v20.x.x zeigen
npm --version   # sollte 10.x.x zeigen
```

### 3. pnpm Package Manager
```bash
# pnpm global installieren
npm install -g pnpm

# Version prüfen
pnpm --version  # sollte 8.x.x zeigen
```

### 4. Docker & Docker Compose (Optional, für Production)
```bash
# Docker Installation
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# User zu docker Gruppe hinzufügen
sudo usermod -aG docker $USER

# Docker Compose installieren
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Neuanmeldung erforderlich oder:
newgrp docker

# Versionen prüfen
docker --version
docker-compose --version
```

### 5. Git Configuration
```bash
# Git global konfigurieren
git config --global user.name "Dein Name"
git config --global user.email "deine@email.com"
```

## 🚀 Installation Methods

### Method 0: 🔥 Automatische Installation (Empfohlen)

**One-Command Setup - Alles automatisch:**

```bash
# Download und ausführen des automatischen Installers
curl -fsSL https://raw.githubusercontent.com/naix1337/wikidocs-/main/setup-auto.sh | bash
```

**Oder mit wget:**
```bash
wget -qO- https://raw.githubusercontent.com/naix1337/wikidocs-/main/setup-auto.sh | bash
```

**Features des automatischen Installers:**
- ✅ **OS-Erkennung** (Ubuntu, Debian, CentOS, Fedora, Arch)
- ✅ **Automatische System-Updates**
- ✅ **Node.js 20.x Installation**
- ✅ **pnpm Package Manager**
- ✅ **Git Repository Download**
- ✅ **Alle Dependencies Installation**
- ✅ **Datenbank Setup mit Demo-Daten**
- ✅ **Firewall-Konfiguration**
- ✅ **Netzwerk-Setup (0.0.0.0)**
- ✅ **Automatischer Start**

**Schnelle Alternative (für erfahrene User):**
```bash
curl -fsSL https://raw.githubusercontent.com/naix1337/wikidocs-/main/quick-install.sh | bash
```

### Method 1: Quick Development Setup (Manuell)

```bash
# 1. Repository klonen
git clone https://github.com/naix1337/wikidocs-.git
cd wikidocs-

# 2. Frontend Dependencies installieren
cd app/frontend
pnpm install

# 3. Frontend starten
pnpm dev
```

**✅ Das war's!** Die App läuft auf:
- Lokal: http://localhost:5173
- Netzwerk: http://[IHRE-IP]:5173 (von anderen Geräten erreichbar)

### Method 2: Full Stack Development

```bash
# 1. Repository klonen
git clone https://github.com/naix1337/wikidocs-.git
cd wikidocs-

# 2. Alle Dependencies installieren
make install
# Oder manuell:
# cd app/frontend && pnpm install
# cd ../backend && pnpm install

# 3. Environment Variables konfigurieren
cp app/backend/.env.example app/backend/.env
cp app/frontend/.env.example app/frontend/.env

# 4. Backend Database setup
cd app/backend
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# 5. Development starten
cd ../..
make dev
# Oder manuell:
# Terminal 1: cd app/backend && pnpm start:dev
# Terminal 2: cd app/frontend && pnpm dev
```

**Zugriff:**
- Frontend: http://localhost:5173 (lokal) | http://[IHRE-IP]:5173 (netzwerk)
- Backend API: http://localhost:3001 (lokal) | http://[IHRE-IP]:3001 (netzwerk)
- API Docs: http://localhost:3001/api (lokal) | http://[IHRE-IP]:3001/api (netzwerk)

### Method 3: Docker Production Deployment

```bash
# 1. Repository klonen
git clone https://github.com/naix1337/wikidocs-.git
cd wikidocs-

# 2. Environment für Production konfigurieren
cp app/infra/.env.example app/infra/.env
# Editiere .env Datei mit deinen Production-Settings

# 3. Docker Deployment starten
make docker-up
# Oder: docker-compose -f app/infra/docker-compose.yml up -d

# 4. Logs prüfen
docker-compose -f app/infra/docker-compose.yml logs -f
```

**Zugriff:** http://localhost (Port 80)

## 🔑 Login Credentials

Nach der Installation kannst du dich mit folgenden Demo-Accounts einloggen:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@wiki.local` | `admin123` | Vollzugriff, User-Management |
| **Editor** | `editor@wiki.local` | `editor123` | Content erstellen/bearbeiten |
| **Viewer** | `viewer@wiki.local` | `viewer123` | Nur Lesen |

## 🌐 Network Access Configuration

Das WikiDocs-System ist bereits für den Netzwerk-Zugriff konfiguriert und hört auf allen Netzwerk-Interfaces (`0.0.0.0`).

### Lokale IP-Adresse ermitteln

```bash
# Aktuelle IP-Adresse anzeigen
hostname -I | awk '{print $1}'
# Oder
ip route get 1 | awk '{print $7}' | head -1
# Oder alle Netzwerk-Interfaces anzeigen
ip addr show
```

### Zugriff von anderen Geräten

Nach dem Start der Anwendung ist sie erreichbar unter:

**Frontend:**
- Lokal: `http://localhost:5173`
- Netzwerk: `http://[IHRE-IP]:5173`
- Beispiel: `http://192.168.1.100:5173`

**Backend API:**
- Lokal: `http://localhost:3001`
- Netzwerk: `http://[IHRE-IP]:3001`
- API Docs: `http://[IHRE-IP]:3001/api`

### Firewall-Konfiguration

```bash
# Ubuntu/Debian - Ports öffnen
sudo ufw allow 5173/tcp comment "WikiDocs Frontend"
sudo ufw allow 3001/tcp comment "WikiDocs Backend"

# CentOS/RHEL - Firewalld
sudo firewall-cmd --permanent --add-port=5173/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload

# Status prüfen
sudo ufw status          # Ubuntu/Debian
sudo firewall-cmd --list-all  # CentOS/RHEL
```

### Mobile Geräte & Tablets

Die Anwendung ist vollständig responsive und funktioniert auf:
- 📱 **Smartphones** (iOS, Android)
- 📱 **Tablets** (iPad, Android Tablets)
- 💻 **Laptops & Desktops**
- 🖥️ **Smart TVs** mit Webbrowser

Einfach die IP-Adresse des Servers in den Browser eingeben: `http://[SERVER-IP]:5173`

## 🛠️ Verfügbare Make Commands

```bash
# Development
make dev              # Start Frontend + Backend
make frontend         # Nur Frontend
make backend          # Nur Backend

# Dependencies
make install          # Installiere alle Dependencies
make clean            # Lösche node_modules

# Building
make build            # Baue Production builds
make build-frontend   # Nur Frontend build
make build-backend    # Nur Backend build

# Docker
make docker-up        # Starte mit Docker Compose
make docker-down      # Stoppe Docker Container
make docker-build     # Baue Docker Images neu

# Database
make db-reset         # Database zurücksetzen
make db-seed          # Demo-Daten laden
make db-migrate       # Migrations ausführen
```

## 🔧 Troubleshooting

### Port bereits in Verwendung
```bash
# Prüfe welcher Prozess den Port verwendet
sudo lsof -i :5173
sudo lsof -i :3000

# Prozess beenden
sudo kill -9 <PID>

# Oder anderen Port verwenden
cd app/frontend
pnpm dev --port 5174
```

### Permission Errors
```bash
# Node.js Permissions fix
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Docker ohne sudo
sudo usermod -aG docker $USER
newgrp docker
```

### Database Connection Issues
```bash
# SQLite Permissions (Development)
sudo chmod 664 app/backend/prisma/dev.db
sudo chown $(whoami):$(whoami) app/backend/prisma/dev.db

# Prisma reset
cd app/backend
pnpm prisma db push --force-reset
pnpm prisma db seed
```

### Build Errors
```bash
# Clear alle Caches
make clean
rm -rf app/frontend/dist
rm -rf app/backend/dist

# Neuinstallation
make install
make build
```

## 🔒 Security & Production Setup

### Firewall Configuration
```bash
# UFW Firewall setup
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw status
```

### SSL/HTTPS Setup (mit Let's Encrypt)
```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# SSL Zertifikat erstellen
sudo certbot --nginx -d yourdomain.com

# Auto-renewal testen
sudo certbot renew --dry-run
```

### Environment Variables für Production
```bash
# app/infra/.env
POSTGRES_DB=wikidocs_prod
POSTGRES_USER=wikidocs_user
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
DATABASE_URL="postgresql://wikidocs_user:your_secure_password@postgres:5432/wikidocs_prod"
```

## 🚦 Service Management (Systemd)

### Frontend Service
```bash
# /etc/systemd/system/wikidocs-frontend.service
sudo tee /etc/systemd/system/wikidocs-frontend.service > /dev/null <<EOF
[Unit]
Description=WikiDocs Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/wikidocs/app/frontend
ExecStart=/usr/bin/pnpm preview --host 0.0.0.0 --port 5173
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Service aktivieren
sudo systemctl enable wikidocs-frontend
sudo systemctl start wikidocs-frontend
sudo systemctl status wikidocs-frontend
```

### Backend Service
```bash
# /etc/systemd/system/wikidocs-backend.service
sudo tee /etc/systemd/system/wikidocs-backend.service > /dev/null <<EOF
[Unit]
Description=WikiDocs Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/wikidocs/app/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/pnpm start:prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Service aktivieren
sudo systemctl enable wikidocs-backend
sudo systemctl start wikidocs-backend
sudo systemctl status wikidocs-backend
```

## 📊 Monitoring & Logs

### Log Files prüfen
```bash
# Application Logs
sudo journalctl -u wikidocs-frontend -f
sudo journalctl -u wikidocs-backend -f

# Docker Logs
docker-compose -f app/infra/docker-compose.yml logs -f

# Nginx Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Resource Monitoring
```bash
# System Resources
htop
df -h
free -h

# Docker Resources
docker stats
docker system df
```

## 🔄 Backup & Updates

### Backup Script
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backup/wikidocs/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Database backup
docker exec wikidocs_postgres pg_dump -U wikidocs_user wikidocs_prod > $BACKUP_DIR/database.sql

# File uploads backup
cp -r /var/www/wikidocs/uploads $BACKUP_DIR/

# Configuration backup
cp -r /var/www/wikidocs/app/infra/.env $BACKUP_DIR/

echo "Backup created at $BACKUP_DIR"
```

### Update Prozess
```bash
# 1. Backup erstellen
./backup.sh

# 2. Code aktualisieren
cd /var/www/wikidocs
git pull origin main

# 3. Dependencies aktualisieren
make install

# 4. Database migrieren
cd app/backend
pnpm prisma migrate deploy

# 5. Services neustarten
sudo systemctl restart wikidocs-frontend
sudo systemctl restart wikidocs-backend
```

## 📞 Support

### Log Analysis
```bash
# Fehler in Logs finden
sudo journalctl -u wikidocs-backend --since "1 hour ago" | grep -i error
sudo journalctl -u wikidocs-frontend --since "1 hour ago" | grep -i error
```

### Performance Tuning
```bash
# Node.js Memory Limit erhöhen
export NODE_OPTIONS="--max-old-space-size=4096"

# PM2 für Production (Alternative zu systemd)
npm install -g pm2
pm2 start app/backend/dist/main.js --name wikidocs-backend
pm2 start app/frontend/dist/main.js --name wikidocs-frontend
pm2 startup
pm2 save
```

---

**Bei Problemen:** Erstelle ein GitHub Issue mit Logs und System-Informationen!