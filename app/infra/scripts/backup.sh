#!/bin/bash

# Wiki System Backup Script
# This script creates a complete backup of the PostgreSQL database and uploaded files

set -e

# Configuration
BACKUP_DIR="./backups"
DB_CONTAINER="wiki-postgres"
DB_NAME="wiki"
DB_USER="wiki"
UPLOADS_DIR="./uploads"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="wiki_backup_$TIMESTAMP"

echo "🔄 Starting backup: $BACKUP_NAME"

# 1. Database backup
echo "📊 Backing up database..."
docker exec $DB_CONTAINER pg_dump -U $DB_USER -d $DB_NAME --no-owner --no-privileges > "$BACKUP_DIR/${BACKUP_NAME}.sql"

if [ $? -eq 0 ]; then
    echo "✅ Database backup completed"
else
    echo "❌ Database backup failed"
    exit 1
fi

# 2. Uploads backup (if directory exists)
if [ -d "$UPLOADS_DIR" ]; then
    echo "📁 Backing up uploads..."
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" -C "$UPLOADS_DIR" .
    
    if [ $? -eq 0 ]; then
        echo "✅ Uploads backup completed"
    else
        echo "❌ Uploads backup failed"
        exit 1
    fi
else
    echo "⚠️  Uploads directory not found, skipping..."
fi

# 3. Create metadata file
echo "📋 Creating backup metadata..."
cat > "$BACKUP_DIR/${BACKUP_NAME}_metadata.json" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "timestamp": "$TIMESTAMP",
  "database": "$DB_NAME",
  "database_file": "${BACKUP_NAME}.sql",
  "uploads_file": "${BACKUP_NAME}_uploads.tar.gz",
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0"
}
EOF

# 4. Cleanup old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "wiki_backup_*" -type f -mtime +$RETENTION_DAYS -delete

# 5. Show backup summary
echo ""
echo "🎉 Backup completed successfully!"
echo "📂 Backup location: $BACKUP_DIR"
echo "📄 Database: ${BACKUP_NAME}.sql"
if [ -d "$UPLOADS_DIR" ]; then
    echo "📁 Uploads: ${BACKUP_NAME}_uploads.tar.gz"
fi
echo "📋 Metadata: ${BACKUP_NAME}_metadata.json"

# Calculate sizes
DB_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.sql" | cut -f1)
echo "💾 Database backup size: $DB_SIZE"

if [ -f "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" ]; then
    UPLOADS_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" | cut -f1)
    echo "📁 Uploads backup size: $UPLOADS_SIZE"
fi

echo ""
echo "To restore this backup, run:"
echo "  ./scripts/restore.sh $BACKUP_NAME"