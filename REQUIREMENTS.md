# 📋 System Requirements & Quick Install

## 🐧 Linux Installation (Ein-Kommando-Installation)

### Automatische Installation:
```bash
curl -sSL https://raw.githubusercontent.com/naix1337/wikidocs-/main/install-linux.sh | bash
```

### Manuelle Schnellinstallation:
```bash
# 1. Dependencies
sudo apt update && sudo apt install -y curl wget git build-essential

# 2. Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. pnpm
npm install -g pnpm

# 4. Clone & Run
git clone https://github.com/naix1337/wikidocs-.git
cd wikidocs-/app/frontend
pnpm install
pnpm dev
```

**✅ Fertig!** App läuft auf http://localhost:5173

## 💻 System Requirements

### Minimum:
- **OS**: Ubuntu 20.04+, Debian 11+, CentOS 8+
- **RAM**: 2GB
- **Storage**: 5GB
- **CPU**: 2 Cores
- **Node.js**: 18.0+
- **Internet**: Für Dependencies

### Empfohlen:
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 8GB+
- **Storage**: 20GB+ SSD
- **CPU**: 4+ Cores
- **Node.js**: 20.x
- **Docker**: Für Production

## 🔑 Login-Daten (nach Installation)

| Rolle | Email | Password | Rechte |
|-------|--------|----------|--------|
| **Admin** | `admin@wiki.local` | `admin123` | Alles |
| **Editor** | `editor@wiki.local` | `editor123` | Content |
| **Viewer** | `viewer@wiki.local` | `viewer123` | Lesen |

## 🚀 Deployment-Optionen

### 1. Development (lokal)
```bash
pnpm dev  # Frontend: localhost:5173
```

### 2. Full Stack (Frontend + Backend)
```bash
make install  # Alle Dependencies
make dev      # Beide Services starten
```

### 3. Docker Production
```bash
make docker-up  # Production auf Port 80
```

## 🛠️ Verfügbare Commands

```bash
# Development
make dev              # Start alles
make frontend         # Nur Frontend
make backend          # Nur Backend

# Build
make build            # Production Build
make install          # Dependencies installieren
make clean            # Cache löschen

# Docker
make docker-up        # Production starten
make docker-down      # Stoppen
make docker-build     # Images neu bauen

# Database
make db-reset         # DB zurücksetzen
make db-seed          # Demo-Daten laden
```

## 📦 Was wird installiert?

### Dependencies:
- **Node.js 20+** (JavaScript Runtime)
- **pnpm** (Package Manager)
- **Git** (Versionskontrolle)
- **Build Tools** (Kompilierung)

### Optionale Production Tools:
- **Docker & Docker Compose**
- **Nginx** (Reverse Proxy)
- **PostgreSQL** (Production DB)
- **PM2** (Process Manager)

## 🔧 Troubleshooting

### Häufige Probleme:

**Port bereits belegt:**
```bash
sudo lsof -i :5173  # Welcher Prozess?
pnpm dev --port 5174  # Anderen Port verwenden
```

**Permission Errors:**
```bash
sudo chown -R $(whoami) ~/.npm
sudo usermod -aG docker $USER  # Docker ohne sudo
```

**Build Fehler:**
```bash
make clean    # Cache löschen
make install  # Neu installieren
```

## 📚 Weitere Dokumentation

- **Vollständige Linux-Installation**: `INSTALL_LINUX.md`
- **Architektur & Development**: `docs/ARCHITECTURE.md` 
- **API Documentation**: http://localhost:3000/api (nach Backend-Start)
- **GitHub Repository**: https://github.com/naix1337/wikidocs-

## 🌐 Ports & URLs

| Service | Development | Production | Beschreibung |
|---------|-------------|------------|--------------|
| Frontend | :5173 | :80 | React App |
| Backend | :3000 | :80/api | NestJS API |
| Database | :5432 | intern | PostgreSQL |
| Docs | :3000/api | :80/api | Swagger UI |

## 📞 Support

- **GitHub Issues**: https://github.com/naix1337/wikidocs-/issues
- **Dokumentation**: Vollständige Guides im Repository
- **Quick Help**: Siehe `INSTALL_LINUX.md` für detaillierte Hilfe

---
**🚀 Schnellstart: Ein Kommando, fertig!** 
```bash
curl -sSL https://raw.githubusercontent.com/naix1337/wikidocs-/main/install-linux.sh | bash
```