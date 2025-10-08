#!/bin/bash

# 🚀 WikiDocs Automatisches Setup Script für Linux
# Dieses Script installiert automatisch alle Dependencies und richtet WikiDocs ein

set -e  # Bei Fehlern abbrechen

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging Funktionen
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Progress Bar Funktion
show_progress() {
    local duration=$1
    local task_name=$2
    echo -ne "${CYAN}$task_name...${NC} "
    
    for ((i=0; i<=duration; i++)); do
        echo -ne "▓"
        sleep 0.1
    done
    echo -e " ${GREEN}✓${NC}"
}

# Banner anzeigen
show_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 WIKIDOCS INSTALLER                     ║"
    echo "║              Automatisches Setup für Linux                  ║"
    echo "║                                                              ║"
    echo "║  • Installiert alle Dependencies automatisch                ║"
    echo "║  • Richtet Node.js, pnpm und Git ein                       ║"
    echo "║  • Lädt WikiDocs herunter und konfiguriert es              ║"
    echo "║  • Startet die Anwendung automatisch                       ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# OS Detection
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VERSION=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VERSION=$(lsb_release -sr)
    elif [[ -f /etc/redhat-release ]]; then
        OS="Red Hat Enterprise Linux"
        VERSION=$(grep -oE '[0-9]+\.[0-9]+' /etc/redhat-release)
    else
        OS=$(uname -s)
        VERSION=$(uname -r)
    fi
    
    log_info "Detected OS: $OS $VERSION"
}

# Root Check
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_warning "Dieses Script sollte NICHT als root ausgeführt werden!"
        log_warning "Bitte als normaler User ausführen (sudo wird automatisch verwendet wo nötig)"
        exit 1
    fi
}

# Dependencies Check
check_dependencies() {
    log_step "Prüfe System Dependencies..."
    
    local missing_deps=()
    
    # Basis Tools
    command -v curl >/dev/null 2>&1 || missing_deps+=("curl")
    command -v wget >/dev/null 2>&1 || missing_deps+=("wget")
    command -v git >/dev/null 2>&1 || missing_deps+=("git")
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_warning "Fehlende Dependencies: ${missing_deps[*]}"
        return 1
    fi
    
    log_success "Alle Basis-Dependencies vorhanden"
    return 0
}

# System Update
update_system() {
    log_step "System Update..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt update -qq
        show_progress 20 "Updating package lists"
        sudo apt upgrade -y -qq
        show_progress 30 "Upgrading packages"
        
        # Install basic dependencies
        sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
        show_progress 15 "Installing basic tools"
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        if command -v dnf >/dev/null 2>&1; then
            sudo dnf update -y -q
            show_progress 25 "Updating system with dnf"
            sudo dnf install -y curl wget git make gcc-c++ ca-certificates
        else
            sudo yum update -y -q
            show_progress 25 "Updating system with yum"
            sudo yum install -y curl wget git make gcc-c++ ca-certificates
        fi
        show_progress 15 "Installing basic tools"
        
    elif [[ "$OS" == *"Arch"* ]]; then
        sudo pacman -Syu --noconfirm
        show_progress 25 "Updating Arch system"
        sudo pacman -S --noconfirm curl wget git base-devel
        show_progress 15 "Installing basic tools"
    fi
    
    log_success "System erfolgreich aktualisiert"
}

# Node.js Installation
install_nodejs() {
    log_step "Node.js Installation..."
    
    # Check if Node.js already installed and version
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version | sed 's/v//')
        MAJOR_VERSION=${NODE_VERSION%%.*}
        
        if [[ $MAJOR_VERSION -ge 18 ]]; then
            log_success "Node.js $NODE_VERSION bereits installiert (>= 18.x)"
            return 0
        else
            log_warning "Node.js $NODE_VERSION zu alt, installiere neue Version..."
        fi
    fi
    
    # Install Node.js 20.x
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        show_progress 20 "Adding NodeSource repository"
        sudo apt install -y nodejs
        show_progress 25 "Installing Node.js 20.x"
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        show_progress 20 "Adding NodeSource repository"
        if command -v dnf >/dev/null 2>&1; then
            sudo dnf install -y nodejs
        else
            sudo yum install -y nodejs
        fi
        show_progress 25 "Installing Node.js 20.x"
        
    elif [[ "$OS" == *"Arch"* ]]; then
        sudo pacman -S --noconfirm nodejs npm
        show_progress 25 "Installing Node.js from Arch repos"
    fi
    
    # Verify installation
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        log_success "Node.js $NODE_VERSION und npm $NPM_VERSION installiert"
    else
        log_error "Node.js Installation fehlgeschlagen!"
        exit 1
    fi
}

# pnpm Installation
install_pnpm() {
    log_step "pnpm Installation..."
    
    if command -v pnpm >/dev/null 2>&1; then
        PNPM_VERSION=$(pnpm --version)
        log_success "pnpm $PNPM_VERSION bereits installiert"
        return 0
    fi
    
    # Install pnpm
    npm install -g pnpm
    show_progress 20 "Installing pnpm globally"
    
    # Verify installation
    if command -v pnpm >/dev/null 2>&1; then
        PNPM_VERSION=$(pnpm --version)
        log_success "pnpm $PNPM_VERSION installiert"
    else
        log_error "pnpm Installation fehlgeschlagen!"
        exit 1
    fi
}

# Firewall Configuration
configure_firewall() {
    log_step "Firewall konfigurieren..."
    
    if command -v ufw >/dev/null 2>&1; then
        # Ubuntu/Debian UFW
        sudo ufw allow 5173/tcp comment "WikiDocs Frontend" 2>/dev/null || true
        sudo ufw allow 3001/tcp comment "WikiDocs Backend" 2>/dev/null || true
        show_progress 10 "Configuring UFW firewall"
        log_success "UFW Firewall konfiguriert (Ports 5173, 3001)"
        
    elif command -v firewall-cmd >/dev/null 2>&1; then
        # CentOS/RHEL/Fedora Firewalld
        sudo firewall-cmd --permanent --add-port=5173/tcp 2>/dev/null || true
        sudo firewall-cmd --permanent --add-port=3001/tcp 2>/dev/null || true
        sudo firewall-cmd --reload 2>/dev/null || true
        show_progress 10 "Configuring Firewalld"
        log_success "Firewalld konfiguriert (Ports 5173, 3001)"
        
    else
        log_warning "Kein bekanntes Firewall-System gefunden (ufw/firewalld)"
        log_info "Manuelle Konfiguration eventuell erforderlich für Ports 5173 und 3001"
    fi
}

# Project Setup
setup_project() {
    log_step "WikiDocs Projekt Setup..."
    
    # Create project directory
    PROJECT_DIR="$HOME/wikidocs"
    if [[ -d "$PROJECT_DIR" ]]; then
        log_warning "Verzeichnis $PROJECT_DIR existiert bereits"
        read -p "Überschreiben? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$PROJECT_DIR"
            log_info "Verzeichnis entfernt"
        else
            log_error "Installation abgebrochen"
            exit 1
        fi
    fi
    
    # Clone repository
    git clone https://github.com/naix1337/wikidocs-.git "$PROJECT_DIR"
    show_progress 30 "Cloning WikiDocs repository"
    
    cd "$PROJECT_DIR"
    
    # Install dependencies
    log_step "Dependencies installieren..."
    
    # Root dependencies
    if [[ -f "package.json" ]]; then
        pnpm install
        show_progress 20 "Installing root dependencies"
    fi
    
    # Frontend dependencies
    cd app/frontend
    pnpm install
    show_progress 40 "Installing frontend dependencies"
    
    # Backend dependencies
    cd ../backend
    pnpm install
    show_progress 40 "Installing backend dependencies"
    
    log_success "Alle Dependencies installiert"
}

# Database Setup
setup_database() {
    log_step "Datenbank Setup..."
    
    cd "$PROJECT_DIR/app/backend"
    
    # Generate Prisma client
    pnpm prisma generate
    show_progress 15 "Generating Prisma client"
    
    # Setup database
    pnpm prisma db push
    show_progress 10 "Setting up database schema"
    
    # Seed database
    pnpm prisma db seed
    show_progress 15 "Seeding database with demo data"
    
    log_success "Datenbank erfolgreich eingerichtet"
}

# Get Network Information
get_network_info() {
    # Get local IP address
    if command -v hostname >/dev/null 2>&1; then
        LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
    elif command -v ip >/dev/null 2>&1; then
        LOCAL_IP=$(ip route get 1 | awk '{print $7}' | head -1 2>/dev/null || echo "localhost")
    else
        LOCAL_IP="localhost"
    fi
}

# Start Application
start_application() {
    log_step "Anwendung starten..."
    
    cd "$PROJECT_DIR"
    
    get_network_info
    
    log_success "🎉 WikiDocs Installation abgeschlossen!"
    echo
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    ✅ INSTALLATION ERFOLGREICH                ║${NC}"
    echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║${NC}  🌐 Zugriff:                                               ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}     Lokal:    http://localhost:5173                        ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}     Netzwerk: http://$LOCAL_IP:5173                ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                             ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  📚 Demo-Accounts:                                         ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}     Admin:  admin@wiki.local  / admin123                   ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}     Editor: editor@wiki.local / editor123                  ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}     Viewer: viewer@wiki.local / viewer123                  ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                             ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  🚀 Starten: cd $PROJECT_DIR && pnpm dev     ${GREEN}║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    # Ask to start now
    read -p "Anwendung jetzt starten? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        log_info "Starte WikiDocs..."
        echo -e "${YELLOW}Hinweis: Verwende Ctrl+C um die Anwendung zu stoppen${NC}"
        echo
        
        # Start with concurrently if available, otherwise start frontend only
        if [[ -f "package.json" ]] && pnpm list concurrently >/dev/null 2>&1; then
            pnpm dev
        else
            cd app/frontend
            pnpm dev --host 0.0.0.0
        fi
    else
        log_info "Starte später mit: cd $PROJECT_DIR && pnpm dev"
    fi
}

# Cleanup function for interrupts
cleanup() {
    log_warning "Installation unterbrochen!"
    exit 1
}

# Error handler
error_handler() {
    log_error "Ein Fehler ist aufgetreten in Zeile $1"
    log_error "Befehl: $BASH_COMMAND"
    exit 1
}

# Main installation function
main() {
    # Setup error handling
    trap cleanup SIGINT SIGTERM
    trap 'error_handler $LINENO' ERR
    
    show_banner
    
    # Pre-checks
    check_root
    detect_os
    
    # System preparation
    if ! check_dependencies; then
        update_system
    else
        log_info "System Dependencies bereits vorhanden, überspringe Update"
    fi
    
    # Install components
    install_nodejs
    install_pnpm
    configure_firewall
    setup_project
    setup_database
    start_application
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi