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

db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(RESET)"
	$(SERVER_CMD)

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
