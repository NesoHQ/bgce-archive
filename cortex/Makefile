GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

.DEFAULT_GOAL := help

## ------------------------------
## 🚀 Build & Run
## ------------------------------

all: help ## Show this help (default)

build: install-deps ## Build the Go binary
	go build -o ${TARGET} ${MAIN}

start: build run-server ## Build and start server

run-server: ## Run the server
	${SERVER_CMD}

dev: prepare ## Start server in development mode
	air serve-rest

seed: build ## Seed database
	./${TARGET} seed

test: ## Run all tests
	go test -v ./...

## ------------------------------
## 📦 Dependencies
## ------------------------------

install-deps: ## Install Go dependencies
	go mod download

tidy: ## Clean up go.mod
	go mod tidy

install-proto-deps: ## Install protobuf dependencies
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

install-dev-deps: ## Install dev tools (air)
	go install github.com/air-verse/air@latest

install-mockgen: ## Install mockgen
	go install go.uber.org/mock/mockgen@latest

prepare: install-proto-deps install-dev-deps install-deps tidy ## Prepare dev environment

## ------------------------------
## 🛠 Codegen
## ------------------------------

build-proto: ## Generate protobuf code
	protoc ${PROTOC_FLAGS} ${CORTEX_PROTO_FILES}

ent-schema: ## Generate new Ent schema (NAME=Category)
	go run -mod=mod entgo.io/ent/cmd/ent new ${NAME}

ent-gen: ## Generate Ent code
	go generate ./ent

## ------------------------------
## 📖 Help
## ------------------------------

help: ## Show this help
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2}'
	@echo ''
	@echo "Default target: ${CYAN}help${RESET}"
