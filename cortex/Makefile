GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

# Project variables
TARGET := cortex
MAIN := main.go
SERVER_CMD := ./$(TARGET) serve-rest

.DEFAULT_GOAL := help

## ------------------------------
## 🚀 Build & Run
## ------------------------------

all: help ## Show this help (default)

build: install-deps ## Build the Go binary
	@echo "$(GREEN)Building $(TARGET)...$(RESET)"
	go build -o $(TARGET) $(MAIN)

start: build run-server ## Build and start server

run-server: ## Run the server
	@echo "$(GREEN)Starting server...$(RESET)"
	$(SERVER_CMD)

dev: prepare ## Start server in development mode
	@echo "$(GREEN)Starting development server...$(RESET)"
	air serve-rest

test: ## Run all tests
	@echo "$(GREEN)Running tests...$(RESET)"
	go test -v ./...

clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(RESET)"
	rm -f $(TARGET)

## ------------------------------
## 🐳 Docker
## ------------------------------

docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(RESET)"
	docker build -t cortex:local .

docker-up: ## Start all services with docker-compose
	@echo "$(GREEN)Starting Docker services...$(RESET)"
	docker compose build --no-cache
	docker compose up -d

docker-down: ## Stop all services
	@echo "$(YELLOW)Stopping Docker services...$(RESET)"
	docker compose down

docker-logs: ## Show logs from all services
	docker compose logs -f

docker-restart: docker-down docker-up ## Restart all services

docker-clean: ## Remove all containers, volumes, and images
	@echo "$(YELLOW)Cleaning Docker resources...$(RESET)"
	docker compose down -v
	docker rmi cortex:local 2>/dev/null || true

## ------------------------------
## 📦 Dependencies
## ------------------------------

install-deps: ## Install Go dependencies
	@echo "$(GREEN)Installing dependencies...$(RESET)"
	go mod download

tidy: ## Clean up go.mod
	@echo "$(GREEN)Tidying go.mod...$(RESET)"
	go mod tidy

install-proto-deps: ## Install protobuf dependencies
	@echo "$(GREEN)Installing protobuf dependencies...$(RESET)"
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

install-dev-deps: ## Install dev tools (air)
	@echo "$(GREEN)Installing development tools...$(RESET)"
	go install github.com/air-verse/air@latest

install-mockgen: ## Install mockgen
	@echo "$(GREEN)Installing mockgen...$(RESET)"
	go install go.uber.org/mock/mockgen@latest

prepare: install-proto-deps install-dev-deps install-deps tidy ## Prepare dev environment

## ------------------------------
## 🛠 Codegen
## ------------------------------

build-proto: ## Generate protobuf code
	@echo "$(GREEN)Generating protobuf code...$(RESET)"
	protoc $(PROTOC_FLAGS) $(CORTEX_PROTO_FILES)

ent-schema: ## Generate new Ent schema (NAME=Category)
	@echo "$(GREEN)Generating Ent schema for $(NAME)...$(RESET)"
	go run -mod=mod entgo.io/ent/cmd/ent new $(NAME)

ent-gen: ## Generate Ent code
	@echo "$(GREEN)Generating Ent code...$(RESET)"
	go generate ./ent

## ------------------------------
## 🗄️ Database
## ------------------------------

db-create: ## Create database if it doesn't exist (auto-handled by app)
	@echo "$(GREEN)Database will be created automatically on first run$(RESET)"

db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(RESET)"
	$(SERVER_CMD)

db-reset: ## Drop and recreate database (WARNING: destroys all data)
	@echo "$(YELLOW)⚠️  WARNING: This will destroy all data!$(RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(YELLOW)Dropping database...$(RESET)"; \
		PGPASSWORD=root psql -h localhost -p 5433 -U postgres -c "DROP DATABASE IF EXISTS cortex_db;"; \
		echo "$(GREEN)Database will be recreated on next run$(RESET)"; \
	fi

seed: build ## Seed database with initial data
	@echo "$(GREEN)Seeding database...$(RESET)"
	./$(TARGET) seed

seed-docker: ## Seed database in Docker container
	@echo "$(GREEN)Seeding database in Docker...$(RESET)"
	docker compose exec bgce_cortex /app/main seed

## ------------------------------
## 📖 Help
## ------------------------------

help: ## Show this help
	@echo ''
	@echo 'Usage:'
	@echo '  $(YELLOW)make$(RESET) $(GREEN)<target>$(RESET)'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(GREEN)%s$(RESET)\n", $$1, $$2}'
	@echo ''
	@echo "Default target: $(CYAN)help$(RESET)"

.PHONY: all build start run-server dev test clean docker-build docker-up docker-down docker-logs docker-restart docker-clean install-deps tidy install-proto-deps install-dev-deps install-mockgen prepare build-proto ent-schema ent-gen db-migrate seed seed-docker help

## ------------------------------
## 🔄 Database Migrations (golang-migrate)
## ------------------------------

migrate-install: ## Install golang-migrate CLI
	@echo "$(GREEN)Installing golang-migrate...$(RESET)"
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

migrate-up: ## Apply all pending migrations
	@echo "$(GREEN)Running migrations...$(RESET)"
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "$(YELLOW)DATABASE_URL not set, using default...$(RESET)"; \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5433/cortex_db?sslmode=disable" up; \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" up; \
	fi

migrate-down: ## Rollback last migration
	@echo "$(YELLOW)Rolling back last migration...$(RESET)"
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5433/cortex_db?sslmode=disable" down 1; \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" down 1; \
	fi

migrate-create: ## Create new migration (usage: make migrate-create NAME=add_user_avatar)
	@if [ -z "$(NAME)" ]; then \
		echo "$(YELLOW)Usage: make migrate-create NAME=migration_name$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Creating migration: $(NAME)$(RESET)"
	migrate create -ext sql -dir ./migrations -seq $(NAME)

migrate-force: ## Force migration version (usage: make migrate-force VERSION=1)
	@if [ -z "$(VERSION)" ]; then \
		echo "$(YELLOW)Usage: make migrate-force VERSION=version_number$(RESET)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Forcing migration version to $(VERSION)...$(RESET)"
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5433/cortex_db?sslmode=disable" force $(VERSION); \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" force $(VERSION); \
	fi

migrate-version: ## Show current migration version
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5433/cortex_db?sslmode=disable" version; \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" version; \
	fi

migrate-goto: ## Migrate to specific version (usage: make migrate-goto VERSION=2)
	@if [ -z "$(VERSION)" ]; then \
		echo "$(YELLOW)Usage: make migrate-goto VERSION=version_number$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Migrating to version $(VERSION)...$(RESET)"
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5433/cortex_db?sslmode=disable" goto $(VERSION); \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" goto $(VERSION); \
	fi
