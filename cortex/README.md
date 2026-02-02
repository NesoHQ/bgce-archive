# Cortex Service — Quick Start Guide

A category management service built with Go, featuring REST APIs, PostgreSQL, Redis caching, and RabbitMQ messaging.

## Prerequisites

- Go 1.23+ installed
- Docker and Docker Compose (for containerized setup)
- Make utility available

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
# Start all services (PostgreSQL, Redis, RabbitMQ, and Cortex)
make docker-up

# View logs
make docker-logs

# Stop all services
make docker-down
```

The service will be available at `http://localhost:5000`

### Docker Commands

- `make docker-build` — Build the Docker image
- `make docker-up` — Start all services
- `make docker-down` — Stop all services
- `make docker-logs` — View logs from all services
- `make docker-restart` — Restart all services
- `make docker-clean` — Remove all containers, volumes, and images

## Local Development Setup

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your local configuration (database, Redis, RabbitMQ URLs).

### 2. Start Dependencies

You can run just the dependencies with Docker:

```bash
docker-compose up -d postgres redis rabbitmq
```

### 3. Prepare the Environment

Install necessary dependencies and tools:

```bash
make prepare
```

This installs:
- Protobuf code generators
- Development tools like `air` for live reload
- Go module dependencies

### 4. Generate Ent Code

Generate database schema code:

```bash
make ent-gen
```

### 5. Run the Server

Start in development mode with live reload:

```bash
make dev
```

Or build and run:

```bash
make start
```

The service will be available at `http://localhost:8080`

## API Documentation

Swagger documentation is available at:
- `http://localhost:5000/swagger/` (Docker)
- `http://localhost:8080/swagger/` (Local)

## Testing

Run all tests:

```bash
make test
```

## Database Management

The service automatically runs migrations on startup. The database schema is managed using Ent.

### Create New Entity Schema

```bash
make ent-schema NAME=YourEntity
```

Then edit the schema in `ent/schema/` and regenerate:

```bash
make ent-gen
```

## Additional Commands

- `make build` — Build the executable
- `make clean` — Clean build artifacts
- `make tidy` — Clean up go.mod
- `make install-mockgen` — Install mockgen for generating mocks
- `make help` — Show all available commands

## Service Endpoints

- **API**: `http://localhost:5000` (Docker) or `http://localhost:8080` (Local)
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **RabbitMQ**: `localhost:5672`
- **RabbitMQ Management**: `http://localhost:15672` (admin/admin)

## Architecture

- **Framework**: Go with standard library HTTP
- **Database**: PostgreSQL with Ent ORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **API Documentation**: Swagger/OpenAPI

---

For more details, see the documentation in the `docs/` directory.
