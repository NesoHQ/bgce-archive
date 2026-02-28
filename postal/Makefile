.PHONY: help build run dev test clean docker-build docker-up docker-down install-air

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the application
	@echo "Building postal..."
	@go build -o postal main.go
	@echo "✅ Build complete"

run: ## Run the application
	@echo "Running postal..."
	@go run main.go rest

dev: ## Run with hot reload (requires air - run 'make install-air' first)
	@if command -v air > /dev/null; then \
		echo "Starting development server with hot reload..."; \
		air; \
	else \
		echo "❌ Air is not installed. Install it with: make install-air"; \
		echo "Or run without hot reload: make run"; \
		exit 1; \
	fi

install-air: ## Install air for hot reload
	@echo "Installing air..."
	@go install github.com/air-verse/air@latest
	@echo "✅ Air installed successfully"
	@echo "Make sure $(go env GOPATH)/bin is in your PATH"

test: ## Run tests
	@echo "Running tests..."
	@go test -v ./...

clean: ## Clean build artifacts
	@echo "Cleaning..."
	@rm -f postal
	@rm -rf tmp/
	@echo "✅ Clean complete"

tidy: ## Tidy go modules
	@echo "Tidying modules..."
	@go mod tidy
	@echo "✅ Tidy complete"

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	@docker build -t postal:latest .
	@echo "✅ Docker image built"

docker-up: ## Start services with docker-compose
	@echo "Starting services..."
	@docker-compose up -d
	@echo "✅ Services started"

docker-down: ## Stop services
	@echo "Stopping services..."
	@docker-compose down
	@echo "✅ Services stopped"

docker-logs: ## View docker logs
	@docker-compose logs -f

migrate: ## Run database migrations
	@echo "Running migrations..."
	@go run main.go migrate
	@echo "✅ Migrations complete"

## ------------------------------
## 🔄 Database Migrations (golang-migrate)
## ------------------------------

migrate-install: ## Install golang-migrate CLI
	@echo "Installing golang-migrate..."
	@go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
	@echo "✅ golang-migrate installed"

migrate-up: ## Apply all pending migrations
	@echo "Running migrations..."
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "DATABASE_URL not set, using default..."; \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5432/postal_db?sslmode=disable" up; \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" up; \
	fi
	@echo "✅ Migrations applied"

migrate-down: ## Rollback last migration
	@echo "Rolling back last migration..."
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5432/postal_db?sslmode=disable" down 1; \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" down 1; \
	fi
	@echo "✅ Migration rolled back"

migrate-create: ## Create new migration (usage: make migrate-create NAME=add_tags_table)
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make migrate-create NAME=migration_name"; \
		exit 1; \
	fi
	@echo "Creating migration: $(NAME)"
	@migrate create -ext sql -dir ./migrations -seq $(NAME)
	@echo "✅ Migration files created"

migrate-force: ## Force migration version (usage: make migrate-force VERSION=1)
	@if [ -z "$(VERSION)" ]; then \
		echo "Usage: make migrate-force VERSION=version_number"; \
		exit 1; \
	fi
	@echo "Forcing migration version to $(VERSION)..."
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5432/postal_db?sslmode=disable" force $(VERSION); \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" force $(VERSION); \
	fi
	@echo "✅ Migration version forced"

migrate-version: ## Show current migration version
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5432/postal_db?sslmode=disable" version; \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" version; \
	fi

migrate-goto: ## Migrate to specific version (usage: make migrate-goto VERSION=2)
	@if [ -z "$(VERSION)" ]; then \
		echo "Usage: make migrate-goto VERSION=version_number"; \
		exit 1; \
	fi
	@echo "Migrating to version $(VERSION)..."
	@if [ -z "$(DATABASE_URL)" ]; then \
		migrate -path ./migrations -database "postgresql://postgres:root@localhost:5432/postal_db?sslmode=disable" goto $(VERSION); \
	else \
		migrate -path ./migrations -database "$(DATABASE_URL)" goto $(VERSION); \
	fi
	@echo "✅ Migrated to version $(VERSION)"
