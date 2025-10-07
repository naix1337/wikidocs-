# Variablen
BACKEND_DIR := app/backend
FRONTEND_DIR := app/frontend
DB_CONTAINER := wiki-postgres
BACKUP_DIR := backups

# Default Target
.DEFAULT_GOAL := help

## Hilfe anzeigen
help:
	@echo "Verfügbare Targets:"
	@echo "  install     - Dependencies installieren"
	@echo "  dev         - Development Environment starten"
	@echo "  build       - Production Build"
	@echo "  test        - Tests ausführen"
	@echo "  lint        - Code Linting"
	@echo "  seed        - Database mit Demo-Daten füllen"
	@echo "  backup      - Database Backup erstellen"
	@echo "  restore     - Database Backup wiederherstellen"
	@echo "  clean       - Build-Artefakte löschen"
	@echo "  reset       - Alles zurücksetzen (VORSICHT!)"

## Dependencies installieren
install:
	@echo "📦 Installiere Dependencies..."
	cd $(BACKEND_DIR) && pnpm install
	cd $(FRONTEND_DIR) && pnpm install

## Development Environment starten
dev:
	@echo "🚀 Starte Development Environment..."
	docker compose -f infra/docker-compose.dev.yml up -d postgres
	@echo "⏳ Warte auf PostgreSQL..."
	@sleep 5
	cd $(BACKEND_DIR) && pnpm prisma migrate dev --name init || true
	@echo "🌱 Fülle Database mit Seed-Daten..."
	cd $(BACKEND_DIR) && pnpm prisma db seed || true
	@echo "🏃‍♂️ Starte Backend & Frontend..."
	@(cd $(BACKEND_DIR) && pnpm start:dev) & \
	(cd $(FRONTEND_DIR) && pnpm dev) & \
	wait

## Production Build
build:
	@echo "🏗️ Erstelle Production Build..."
	cd $(BACKEND_DIR) && pnpm build
	cd $(FRONTEND_DIR) && pnpm build

## Tests ausführen
test:
	@echo "🧪 Führe Tests aus..."
	cd $(BACKEND_DIR) && pnpm test
	cd $(FRONTEND_DIR) && pnpm test

## Code Linting
lint:
	@echo "🔍 Führe Linting aus..."
	cd $(BACKEND_DIR) && pnpm lint
	cd $(FRONTEND_DIR) && pnpm lint

## Database mit Demo-Daten füllen
seed:
	@echo "🌱 Fülle Database mit Demo-Daten..."
	cd $(BACKEND_DIR) && pnpm prisma db seed

## Database Backup erstellen
backup:
	@echo "💾 Erstelle Database Backup..."
	@mkdir -p $(BACKUP_DIR)
	docker exec $(DB_CONTAINER) pg_dump -U wiki wiki > $(BACKUP_DIR)/backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✅ Backup erstellt in $(BACKUP_DIR)/"

## Database Backup wiederherstellen
restore:
ifndef BACKUP_FILE
	@echo "❌ BACKUP_FILE nicht angegeben. Verwendung: make restore BACKUP_FILE=backup-file.sql"
	@exit 1
endif
	@echo "🔄 Stelle Database Backup wieder her..."
	docker exec -i $(DB_CONTAINER) psql -U wiki wiki < $(BACKUP_DIR)/$(BACKUP_FILE)
	@echo "✅ Backup wiederhergestellt"

## Build-Artefakte löschen
clean:
	@echo "🧹 Lösche Build-Artefakte..."
	cd $(BACKEND_DIR) && rm -rf dist node_modules
	cd $(FRONTEND_DIR) && rm -rf dist node_modules
	docker compose -f infra/docker-compose.dev.yml down -v
	docker system prune -f

## Alles zurücksetzen (VORSICHT!)
reset: clean
	@echo "⚠️  ACHTUNG: Lösche ALLE Daten und Container..."
	@read -p "Bist du sicher? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker compose -f infra/docker-compose.yml down -v
	docker compose -f infra/docker-compose.dev.yml down -v
	rm -rf $(BACKUP_DIR)
	@echo "🗑️ Alles zurückgesetzt"

## Docker Compose für Development
dev-up:
	@echo "🐳 Starte Development Container..."
	docker compose -f infra/docker-compose.dev.yml up -d

## Docker Compose für Development stoppen
dev-down:
	@echo "🛑 Stoppe Development Container..."
	docker compose -f infra/docker-compose.dev.yml down

## Production starten
prod-up:
	@echo "🚀 Starte Production Environment..."
	docker compose -f infra/docker-compose.yml up -d

## Production stoppen
prod-down:
	@echo "🛑 Stoppe Production Environment..."
	docker compose -f infra/docker-compose.yml down

## Logs anzeigen
logs:
	docker compose -f infra/docker-compose.yml logs -f

## Database Migration
migrate:
	@echo "🔄 Führe Database Migration aus..."
	cd $(BACKEND_DIR) && pnpm prisma migrate deploy

## Prisma Studio
studio:
	@echo "🎨 Öffne Prisma Studio..."
	cd $(BACKEND_DIR) && pnpm prisma studio

.PHONY: help install dev build test lint seed backup restore clean reset dev-up dev-down prod-up prod-down logs migrate studio