# 🚀 WikiDocs - Modern Documentation Platform

A modern, Docker-inspired documentation platform built with React, TypeScript, and NestJS. Features a comprehensive admin panel, content management system, and beautiful user interface.

## ✨ Features

### 🎯 **Complete Wiki System**
- **Modern Docker-inspired UI** with blue navigation header
- **Content Management** - Create, edit, delete pages and spaces
- **Rich Text Editor** with Markdown support and templates
- **Space Organization** - Group related documentation
- **Full Admin Panel** with user management and analytics

### 🔐 **Authentication & Permissions**
- **Role-based Access Control** (Admin, Editor, Viewer)
- **JWT Authentication** with secure session management
- **Demo User System** with persistent login

### 📱 **User Experience**
- **Responsive Design** - Works on all devices
- **Intuitive Navigation** with breadcrumbs and sidebar
- **Live Content Updates** - See changes immediately
- **Search & Filter** - Find content quickly
- **Page Detail View** - Read content in full-screen

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **NestJS** + **TypeScript**
- **Prisma ORM** with SQLite
- **JWT Authentication**
- **Swagger API Documentation**

### Infrastructure
- **Docker & Docker Compose**
- **Nginx** reverse proxy
- **PostgreSQL** for production

## 🚀 Quick Start

### 🔥 Automatische Installation (Linux)

**One-Command Setup:**
```bash
curl -fsSL https://raw.githubusercontent.com/naix1337/wikidocs-/main/setup-auto.sh | bash
```

**Features:**
- ✅ Automatische OS-Erkennung (Ubuntu, Debian, CentOS, Fedora, Arch)
- ✅ System-Updates und Dependencies
- ✅ Node.js 20.x + pnpm Installation
- ✅ Komplettes Projekt Setup
- ✅ Datenbank mit Demo-Daten
- ✅ Firewall-Konfiguration
- ✅ Automatischer Start auf allen Netzwerk-Interfaces

### Option 1: Simple Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/wikidocs.git
cd wikidocs

# 2. Install frontend dependencies
cd app/frontend
pnpm install

# 3. Start the frontend
pnpm dev
```

**That's it!** The app runs in demo mode at http://localhost:5173

### Option 2: Full Stack Setup

```bash
# 1. Install all dependencies
make install

# 2. Set up environment variables
cp app/backend/.env.example app/backend/.env
cp app/frontend/.env.example app/frontend/.env

# 3. Start development servers
make dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Option 3: Docker Deployment

```bash
# Production deployment
make docker-up
```

Access at http://localhost

## 👥 Demo Login Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@wiki.local` | `admin123` | Full access, user management |
| **Editor** | `editor@wiki.local` | `editor123` | Create/edit content |
| **Viewer** | `viewer@wiki.local` | `viewer123` | Read-only access |

## 📁 Project Structure

```
wikidocs/
├── 📱 app/frontend/          # React application
│   ├── src/pages/            # Page components
│   ├── src/stores/           # Zustand stores
│   ├── src/components/       # Reusable components
│   └── src/layouts/          # Layout components
├── 🔧 app/backend/           # NestJS API
│   ├── src/                  # Source code
│   ├── prisma/              # Database schema & seeds
│   └── dist/                # Built output
├── 🐳 app/infra/            # Infrastructure
│   ├── docker-compose.yml   # Docker setup
│   └── nginx/               # Nginx config
├── 📚 docs/                 # Documentation
└── 🔨 Makefile             # Build commands
```

## 🎯 Key Features Implemented

### ✅ **Content Management**
- ✨ Create pages and spaces
- ✨ Rich text editor with toolbar
- ✨ Content templates (User Guide, API Docs, Meeting Notes)
- ✨ Tag system for organization
- ✨ Draft/Published status management

### ✅ **Navigation & Views**
- ✨ Space detail pages with statistics
- ✨ Page detail view with full-screen reading
- ✨ All pages overview with filtering
- ✨ Breadcrumb navigation
- ✨ Dynamic sidebar with space links

### ✅ **Admin Features**
- ✨ Complete admin panel
- ✨ User management (create, edit, delete users)
- ✨ Content overview and management
- ✨ System settings and analytics
- ✨ Role-based permission system

### ✅ **User Experience**
- ✨ Inline editing of pages
- ✨ Auto-redirect after content creation
- ✨ Responsive design for all devices
- ✨ Hover effects and smooth transitions
- ✨ Confirmation dialogs for destructive actions

## 📖 Usage Guide

### Creating Content
1. **Login** with your credentials
2. **Navigate** to "Create content" in the sidebar
3. **Choose** Page or Space
4. **Fill in** title, content, and select a space
5. **Save as Draft** or **Publish** immediately

### Managing Spaces
1. Go to **"Documentation spaces"** in the sidebar
2. **Create new spaces** with the + button
3. **Click "View Space"** to see all pages in a space
4. **Add pages** directly to specific spaces

### Admin Panel
1. **Admin users** see "Admin Panel" in the sidebar
2. **Manage users** - create, edit, delete, change roles
3. **View content** overview and statistics
4. **System settings** and configuration

## 🔧 Development Commands

```bash
# Development
make dev              # Start both frontend and backend
make frontend         # Start only frontend
make backend          # Start only backend

# Building
make build            # Build all applications
make install          # Install all dependencies

# Docker
make docker-up        # Start with Docker Compose
make docker-down      # Stop Docker containers
make docker-build     # Build Docker images

# Database
make db-reset         # Reset database
make db-seed          # Seed with demo data
```

## 🌟 Screenshots & Demo

The application features a modern, Docker-inspired interface with:

- **Clean blue navigation header** with search and user menu
- **Collapsible sidebar** with space navigation
- **Card-based dashboard** with action tiles
- **Rich content editor** with formatting toolbar
- **Responsive tables** for data management
- **Modal dialogs** for forms and confirmations

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/wikidocs/issues)
- 📖 **Documentation**: Check the `/docs` folder
- 🏗️ **Architecture**: See `docs/ARCHITECTURE.md`

---

**Made with ❤️ using React, TypeScript, and NestJS**