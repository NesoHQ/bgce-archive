.PHONY: help build run dev test clean docker-build docker-up docker-down migrate-install migrate-up migrate-down migrate-version

help:
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build:
	@echo "Building community..."
	@go build -o main .
	@echo "Build complete"

run:
	@echo "Running community..."
	@go run . rest

test:
	@echo "Running tests..."
	@go test -v ./...

clean:
	@echo "Cleaning..."
	@rm -f main
	@rm -rf tmp/
	@echo "Clean complete"

tidy:
	@go mod tidy

docker-build:
	@echo "Building Docker image..."
	@docker build -t community:latest .
	@echo "Docker image built"

docker-up:
	@echo "Starting services..."
	@docker compose up -d
	@echo "Services started"

docker-down:
	@echo "Stopping services..."
	@docker compose down
	@echo "Services stopped"

docker-logs:
	@docker compose logs -f

migrate-install: ## Install golang-migrate CLI
	@echo "Installing golang-migrate..."
	@go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
	@echo "golang-migrate installed"

migrate-up: ## Run all pending migrations
	@echo "Running migrations up..."
	@migrate -path ./migrations -database "postgres://postgres:root@localhost:5432/cortex_db?sslmode=disable" up

migrate-down: ## Rollback last migration
	@echo "Rolling back last migration..."
	@migrate -path ./migrations -database "postgres://postgres:root@localhost:5432/cortex_db?sslmode=disable" down 1

migrate-version: ## Show current migration version
	@migrate -path ./migrations -database "postgres://postgres:root@localhost:5432/cortex_db?sslmode=disable" version
