# Wiki/Docs System

Ein modernes Wiki/Dokumentationssystem mit RBAC, Versionierung, Review-Workflow und Volltext-Suche.

## Features

- 🔐 **Authentifizierung** - JWT + Refresh Tokens, RBAC (Admin/Editor/Viewer)
- 📝 **Wiki/Docs** - Markdown Editor mit Live-Preview, Mermaid-Diagramme
- 🔍 **Volltext-Suche** - PostgreSQL Full-Text Search mit Relevanz-Ranking
- 🔄 **Versionierung** - Komplette Versionshistorie mit Diff-Ansicht
- ✅ **Review-Workflow** - Draft → Review → Published mit 4-Augen-Prinzip
- 📁 **Spaces & Tags** - Organisatorische Struktur mit flexiblen Tags
- 📎 **Attachments** - Datei-Upload mit sicherer Auslieferung
- 📊 **Audit-Logs** - Vollständige Nachverfolgung aller Änderungen
- 📤 **Export** - PDF, HTML, ZIP Export von Spaces
- 🎨 **Theming** - Light/Dark Mode, responsive Design
- 💬 **Kommentare** - Kollaborative Diskussion zu Seiten

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- React Router v6, Zustand (State Management)
- Tailwind CSS + shadcn/ui Components
- React Markdown + Mermaid für Diagramme
- React Query für API-Calls

### Backend
- Node.js + NestJS + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication + Refresh Tokens
- Multer für File Uploads
- Nodemailer für E-Mail-Benachrichtigungen

### Infrastructure
- Docker + Docker Compose
- Nginx Reverse Proxy
- PostgreSQL Database
- File Storage (lokal oder S3-kompatibel)

## Quick Start

### 1. Dependencies installieren

```bash
# Root-Verzeichnis
make install

# Oder manuell:
cd app/backend && pnpm install
cd ../frontend && pnpm install
```

### 2. Environment Setup

```bash
# Backend Environment kopieren und anpassen
cp app/backend/.env.example app/backend/.env

# Frontend Environment kopieren und anpassen
cp app/frontend/.env.example app/frontend/.env
```

### 3. Database Setup

```bash
# PostgreSQL starten (Docker)
docker compose up -d postgres

# Database Migration
cd app/backend
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4. Development starten

```bash
# Alles gleichzeitig (empfohlen)
make dev

# Oder einzeln:
# Backend (Port 3001)
cd app/backend && pnpm start:dev

# Frontend (Port 5173)
cd app/frontend && pnpm dev
```

### 5. Production Build

```bash
# Komplettes System
make build

# Production starten
docker compose up -d
```

## Makefile Commands

```bash
make install     # Dependencies installieren
make dev         # Development starten
make build       # Production Build
make test        # Tests ausführen
make lint        # Code Linting
make seed        # Database mit Demo-Daten füllen
make backup      # Database Backup erstellen
make restore     # Database Backup wiederherstellen
make clean       # Build-Artefakte löschen
```

## Default Users (nach Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@wiki.local | admin123 |
| Editor | editor@wiki.local | editor123 |
| Viewer | viewer@wiki.local | viewer123 |

## API Documentation

Nach dem Start ist die API-Dokumentation verfügbar unter:
- Swagger UI: http://localhost:3001/api
- OpenAPI JSON: http://localhost:3001/api-json

## Architecture

```
app/
├── frontend/          # React Frontend
│   ├── src/
│   │   ├── components/    # Wiederverwendbare Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── stores/        # Zustand Stores
│   │   ├── services/      # API Services
│   │   └── utils/         # Utility Funktionen
│   └── public/
├── backend/           # NestJS Backend
│   ├── src/
│   │   ├── auth/          # Authentication Module
│   │   ├── users/         # User Management
│   │   ├── spaces/        # Space Management
│   │   ├── pages/         # Page Management
│   │   ├── search/        # Full-Text Search
│   │   ├── attachments/   # File Upload/Download
│   │   ├── audit/         # Audit Logging
│   │   └── common/        # Shared Code
│   └── prisma/            # Database Schema & Migrations
└── infra/             # Infrastructure
    ├── docker-compose.yml
    ├── nginx.conf
    └── scripts/
```

## Security Features

- 🔒 HTTPS-only mit HSTS
- 🛡️ JWT + Refresh Token Pattern
- 🔐 Argon2id Password Hashing
- 🚦 Rate Limiting für kritische Endpoints
- 🧹 Input Validation & Sanitization
- 🎭 Content Security Policy (CSP)
- 📝 Comprehensive Audit Logging
- 🔍 SQL Injection Prevention (Prisma ORM)
- 📤 Secure File Upload/Download

## Backup & Restore

```bash
# Backup erstellen
make backup

# Backup wiederherstellen
make restore BACKUP_FILE=backup-2023-10-07.sql
```

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://wiki:wiki@localhost:5432/wiki"
JWT_SECRET="your-jwt-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
SMTP_HOST="localhost"
SMTP_PORT=587
SMTP_USER="wiki@example.com"
SMTP_PASS="password"
UPLOAD_DIR="./uploads"
```

### Frontend (.env)
```bash
VITE_API_URL="http://localhost:3001"
VITE_APP_NAME="Wiki System"
```

## Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## License

MIT License - siehe LICENSE Datei für Details.