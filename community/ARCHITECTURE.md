# Community Service - Clean Architecture

## Architecture Overview

The Community service follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles, matching the Postal service structure.

## Directory Structure

```
community/
├── domain/              # Pure domain entitie s
│   ├── comment.go
│   └── discussion.go
├── comment/             # Comment bounded context
│   ├── port.go
│   ├── svc.go
│   ├── service.go
│   └── dto.go
├── discussion/          # Discussion bounded context
│   ├── port.go
│   ├── svc.go
│   ├── service.go
│   └── dto.go
├── repo/                # Infrastructure - Data persistence
│   ├── migrate.go
│   ├── comment_repository.go
│   └── discussion_repository.go
├── config/              # Configuration management
├── rest/                # Presentation layer
│   ├── handlers/
│   ├── middlewares/
│   └── utils/
├── cmd/                 # Application entry points
└── migrations/          # SQL migrations
```

## API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/comments` - List comments (query: post_id, status, limit, offset, sort_by, sort_order)
- `GET /api/v1/discussions` - List discussions (query: category_id, status, sort, limit, offset)

## Dependency Flow

```
Handlers → CommentService, DiscussionService (interfaces)
Services → CommentRepository, DiscussionRepository (interfaces)
Repos → GORM *gorm.DB
```

## Running

```bash
# Local
make run

# Docker
make docker-up
```

## Port

Default: **8082**
