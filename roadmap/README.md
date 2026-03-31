# Roadmap Service - Domain-Driven Design Architecture

## Overview

The Roadmap service manages project roadmaps, including planned, in-progress, and completed cards, as well as changelogs. It follows Domain-Driven Design (DDD) principles and a hexagonal architecture (Ports and Adapters) for a clean, maintainable, and testable codebase.

## Getting Starte d

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Go**: Version 1.25 or higher
- **MongoDB**: A running MongoDB instance (local or remote)
- **Make**: (Optional) For using the provided Makefile commands
- **Docker**: (Optional) For containerized deployment

### Configuration

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd roadmap
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and update the configuration values as needed:
   - `JWT_SECRET`: Secret key for JWT validation
   - `MONGO_DB_URI`: Connection string for your MongoDB
   - `MONGO_DB_NAME`: Database name to use

### Running the Project

#### Locally (Development)

1. Install dependencies:
   ```bash
   go mod download
   ```

2. Start the REST API server:
   ```bash
   go run main.go rest
   ```

The server will start on the port specified in your `.env` (default is `8080`).

#### Using Docker

1. Build the Docker image:
   ```bash
   make build
   ```

2. Run the container (it will use the environment variables from `.env`):
   ```bash
   make run
   ```

3. View logs:
   ```bash
   make logs
   ```

4. Stop the container:
   ```bash
   make stop
   ```

## API Documentation

When running in `debug` mode (set `MODE=debug` in `.env`), you can access the Swagger UI for interactive API documentation at:

```
http://localhost:8080/swagger/
```

The Swagger JSON specification is served at:
```
http://localhost:8080/swagger/swagger.json
```

## Authentication

Management operations (create, update, delete) require a valid JWT token. Provide the token in the `Authorization` header as a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```


## Architecture Layers

### 1. Domain Layer (`domain/`)
- **Pure business entities** with no external dependencies
- `Roadmap` - The aggregate root containing all cards
- `PlannedCard`, `InProgressCard`, `CompletedCard` - Card entities representing different states
- `ChangeLogCard` - Entity for tracking project changes and updates
- `Period` - Value object helper for time-based calculations

### 2. Application Layer (`roadmap/`)
The bounded context contains:
- **`port.go`** - Interfaces (Service, Repository) defining the contracts
- **`service.go`** - Business logic implementation and orchestration
- **`dto.go`** - Data transfer objects for API requests and responses
- **`svc.go`** - Service provider and constructor

### 3. Infrastructure Layer (`repo/`)
- **`repo/`** - Data persistence implementation using MongoDB
- Implements the `Repository` interface defined in `roadmap/port.go`
- Handles operations across all card types (Planned, In-Progress, Completed, ChangeLog)

### 4. Presentation Layer (`rest/`)
- **`handlers/`** - HTTP request handlers for the REST API
- **`middlewares/`** - Authentication (JWT), logging, CORS, rate limiting, and recovery
- **`server.go`** - HTTP server setup and route definitions
- **`utils/`** - Validation logic and response helpers

## Key DDD Principles Applied

### Ports and Adapters (Hexagonal Architecture)
```
Domain (Core) ← Port (Interface) ← Adapter (Implementation)
```

Example:
- **Port**: `roadmap.Repository` interface in `roadmap/port.go`
- **Adapter**: `RoadmapRepository` struct in `repo/roadmap_repository.go` and various files in `repo/`

### Dependency Inversion
- High-level modules (service) depend on abstractions (interfaces)
- Low-level modules (repository) implement those abstractions
- Dependencies flow inward toward the domain logic

### Separation of Concerns
- **Domain**: Pure business rules and entity structures
- **Service**: Use cases, state transitions, and business logic
- **Repository**: Database-specific operations (MongoDB `$push`, `$pull`, `$set`, `$slice`)
- **Handlers**: REST-specific logic (JSON decoding, status codes)

## Package Structure

```
roadmap/
├── domain/              # Pure domain entities
│   ├── roadmap.go
│   ├── planned_card.go
│   ├── in_progress_card.go
│   ├── completed_card.go
│   └── change_log_card.go
├── roadmap/             # Roadmap bounded context
│   ├── port.go         # Interfaces (Service, Repository)
│   ├── service.go      # Business logic
│   ├── dto.go          # API contracts
│   └── svc.go          # Constructor
├── repo/                # Repository implementation (MongoDB)
│   ├── add_planned_card.go
│   ├── create_change_log.go
│   ├── get_change_logs.go
│   └── roadmap_repository.go
├── rest/                # HTTP layer
│   ├── handlers/       # Request handlers
│   ├── middlewares/    # JWT Auth, Logging, etc.
│   ├── utils/         # Request validation
│   └── server.go       # Route definitions
├── cmd/                 # Application entry points
│   └── rest.go
└── main.go              # Root entry point
```

## Features Implemented

1. **Card Management**: CRUD operations for Planned, In-Progress, and Completed cards.
2. **Card Movement**: Smooth transitions between states (e.g., Planned → In Progress).
3. **ChangeLog**: Dedicated tracking for project updates with full CRUD and pagination support.
4. **Pagination**: Efficient data fetching using MongoDB aggregation and `$slice`.
5. **Security**: All management operations are protected by JWT authentication.
6. **Validation**: Robust request body validation using a dedicated utility layer.

## Development Guidelines

### Adding a New Card Type or Feature

1. **Define domain entity** in `domain/`
2. **Update interfaces** in `roadmap/port.go`
3. **Implement service logic** in `roadmap/service.go`
4. **Implement repository methods** in a new file in `repo/`
5. **Add DTOs** in `roadmap/dto.go`
6. **Create handlers** in `rest/handlers/`
7. **Define route** in `rest/server.go`

## References

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
