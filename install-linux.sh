#!/bin/bash
# Linux Quick Setup Script for WikiDocs
# Run: curl -sSL https://raw.githubusercontent.com/naix1337/wikidocs-/main/install-linux.sh | bash

set -e

echo "🚀 WikiDocs Linux Installation Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/debian_version ]; then
        OS="debian"
        print_status "Detected Debian/Ubuntu system"
    elif [ -f /etc/redhat-release ]; then
        OS="redhat"
        print_status "Detected RedHat/CentOS system"
    else
        print_warning "Unknown Linux distribution, assuming Debian-based"
        OS="debian"
    fi
else
    print_error "This script is for Linux only"
    exit 1
fi

# Check if required commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# Install Node.js
install_nodejs() {
    print_status "Installing Node.js 20..."
    
    if [[ "$OS" == "debian" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS" == "redhat" ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    fi
    
    print_success "Node.js installed: $(node --version)"
}

# Install pnpm
install_pnpm() {
    print_status "Installing pnpm..."
    npm install -g pnpm
    print_success "pnpm installed: $(pnpm --version)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing system dependencies..."
    
    if [[ "$OS" == "debian" ]]; then
        sudo apt update
        sudo apt install -y curl wget git build-essential
    elif [[ "$OS" == "redhat" ]]; then
        sudo yum update -y
        sudo yum groupinstall -y "Development Tools"
        sudo yum install -y curl wget git
    fi
    
    print_success "System dependencies installed"
}

# Install Docker (optional)
install_docker() {
    print_status "Installing Docker..."
    
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    print_success "Docker installed. Please log out and back in for group changes to take effect."
}

# Clone and setup WikiDocs
setup_wikidocs() {
    print_status "Cloning WikiDocs repository..."
    
    if [ -d "wikidocs-" ]; then
        print_warning "Directory 'wikidocs-' already exists. Removing..."
        rm -rf wikidocs-
    fi
    
    git clone https://github.com/naix1337/wikidocs-.git
    cd wikidocs-
    
    print_status "Installing frontend dependencies..."
    cd app/frontend
    pnpm install
    
    print_success "WikiDocs setup complete!"
}

# Main installation
main() {
    echo
    print_status "Starting WikiDocs installation..."
    echo
    
    # Check for existing installations
    if check_command node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js already installed: $NODE_VERSION"
        
        # Check if version is 18+
        if [[ ${NODE_VERSION:1:2} -lt 18 ]]; then
            print_warning "Node.js version is older than 18. Updating..."
            install_nodejs
        fi
    else
        install_dependencies
        install_nodejs
    fi
    
    if check_command pnpm; then
        print_success "pnpm already installed: $(pnpm --version)"
    else
        install_pnpm
    fi
    
    # Ask about Docker
    echo
    read -p "Install Docker for production deployment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if check_command docker; then
            print_success "Docker already installed: $(docker --version)"
        else
            install_docker
        fi
    fi
    
    # Setup WikiDocs
    echo
    setup_wikidocs
    
    echo
    print_success "✅ Installation complete!"
    echo
    echo "Next steps:"
    echo "1. cd wikidocs-"
    echo "2. cd app/frontend"
    echo "3. pnpm dev"
    echo
    echo "The app will be available at: http://localhost:5173"
    echo
    echo "Login credentials:"
    echo "  Admin: admin@wiki.local / admin123"
    echo "  Editor: editor@wiki.local / editor123"
    echo "  Viewer: viewer@wiki.local / viewer123"
    echo
    echo "For full documentation see: INSTALL_LINUX.md"
}

# Run installation
main "$@"