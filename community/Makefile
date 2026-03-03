.PHONY: help build run dev test clean docker-build docker-up docker-down

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
