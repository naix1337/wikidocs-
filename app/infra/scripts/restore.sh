#!/bin/bash

# Wiki System Restore Script
# This script restores a backup created by the backup script

set -e

# Configuration
BACKUP_DIR="./backups"
DB_CONTAINER="wiki-postgres"
DB_NAME="wiki"
DB_USER="wiki"
UPLOADS_DIR="./uploads"

# Check if backup name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Backup name is required"
    echo ""
    echo "Usage: $0 <backup_name>"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR" | grep "_metadata.json" | sed 's/_metadata.json//' | sort -r
    exit 1
fi

BACKUP_NAME="$1"
METADATA_FILE="$BACKUP_DIR/${BACKUP_NAME}_metadata.json"
DB_BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.sql"
UPLOADS_BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz"

# Check if backup exists
if [ ! -f "$METADATA_FILE" ]; then
    echo "❌ Error: Backup '$BACKUP_NAME' not found"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR" | grep "_metadata.json" | sed 's/_metadata.json//' | sort -r
    exit 1
fi

echo "🔄 Starting restore: $BACKUP_NAME"

# Show backup information
if command -v jq &> /dev/null; then
    echo "📋 Backup Information:"
    echo "   Created: $(jq -r '.created_at' "$METADATA_FILE")"
    echo "   Database: $(jq -r '.database' "$METADATA_FILE")"
    echo ""
fi

# Confirmation prompt
read -p "⚠️  This will overwrite the current database and uploads. Continue? (y/N): " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Check if database container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "❌ Error: Database container '$DB_CONTAINER' is not running"
    echo "Start it with: docker compose up -d postgres"
    exit 1
fi

# 1. Restore database
if [ -f "$DB_BACKUP_FILE" ]; then
    echo "📊 Restoring database..."
    
    # Drop existing database and recreate
    docker exec $DB_CONTAINER psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    docker exec $DB_CONTAINER psql -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    # Restore from backup
    docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < "$DB_BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Database restore completed"
    else
        echo "❌ Database restore failed"
        exit 1
    fi
else
    echo "❌ Error: Database backup file not found: $DB_BACKUP_FILE"
    exit 1
fi

# 2. Restore uploads
if [ -f "$UPLOADS_BACKUP_FILE" ]; then
    echo "📁 Restoring uploads..."
    
    # Create uploads directory if it doesn't exist
    mkdir -p "$UPLOADS_DIR"
    
    # Remove existing files
    rm -rf "$UPLOADS_DIR"/*
    
    # Extract backup
    tar -xzf "$UPLOADS_BACKUP_FILE" -C "$UPLOADS_DIR"
    
    if [ $? -eq 0 ]; then
        echo "✅ Uploads restore completed"
    else
        echo "❌ Uploads restore failed"
        exit 1
    fi
else
    echo "⚠️  Uploads backup file not found, skipping..."
fi

# 3. Restart services to ensure clean state
echo "🔄 Restarting services..."
if [ -f "docker-compose.yml" ]; then
    docker compose restart backend
elif [ -f "../docker-compose.yml" ]; then
    docker compose -f ../docker-compose.yml restart backend
fi

echo ""
echo "🎉 Restore completed successfully!"
echo "📂 Backup: $BACKUP_NAME"
echo "📊 Database: Restored from ${BACKUP_NAME}.sql"
if [ -f "$UPLOADS_BACKUP_FILE" ]; then
    echo "📁 Uploads: Restored from ${BACKUP_NAME}_uploads.tar.gz"
fi

echo ""
echo "ℹ️  The application should now be running with the restored data."
echo "🔗 Access the application at: http://localhost"