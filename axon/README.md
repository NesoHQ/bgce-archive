# Axon Service - Domain-Driven Design Architecture

## Overview

The Axon service manages notifications with proper domain-driven design (DDD) principles, handling email notifications, user preferences, and template management.

## Architecture Layers

### 1. Domain Layer (`domain/`)
- **Pure business entities** with no external dependencies
- `Notification` - Core notification entity with delivery tracking
- `UserPreference` - User notification settings entity
- `Template` - Email template entity
- Domain types and constants (e.g., `NotificationType`, `NotificationStatus`)

### 2. Application Layer (`notification/`, `template/`, `email/`)
Each bounded context contains:
- **`port.go`** - Interfaces (Service, Repository)
- **`service.go`** - Business logic implementation
- **`repository.go`** - Data persistence implementation

### 3. Infrastructure Layer
- **`cache/`** - DNS caching implementation
- **`config/`** - Configuration management
- **`email/`** - Email provider implementations (SMTP)
- **`queue/`** - RabbitMQ consumer for event-driven notifications
- **`repo/`** - Database migrations and utilities

### 4. Presentation Layer (`rest/`)
- **`handlers/`** - HTTP request handlers
- **`swagger/`** - OpenAPI documentation
- **`server.go`** - HTTP server setup

## Key DDD Principles Applied

### Ports and Adapters (Hexagonal Architecture)
```
Domain (Core) ← Port (Interface) ← Adapter (Implementation)
```

Example:
- **Port**: `notification.Repository` interface in `notification/port.go`
- **Adapter**: `repository` struct in `notification/repository.go`

### Dependency Inversion
- High-level modules (service) depend on abstractions (interfaces)
- Low-level modules (repository) implement those abstractions
- Dependencies flow inward toward the domain

### Separation of Concerns
- **Domain**: Business rules and entities
- **Service**: Use cases and orchestration
- **Repository**: Data access
- **Email Provider**: External email service integration
- **Queue Consumer**: Async event processing
- **Handlers**: HTTP/REST concerns

## Package Structure

```
axon/
├── domain/              # Pure domain entities
│   ├── notification.go
│   └── template.go
├── notification/        # Notification bounded context
│   ├── port.go         # Interfaces (Service, Repository)
│   ├── service.go      # Business logic
│   └── repository.go   # GORM implementation
├── template/            # Template bounded context
│   ├── port.go         # Repository interface
│   └── repository.go   # GORM implementation
├── email/               # Email provider infrastructure
│   ├── provider.go     # Provider interface & factory
│   └── smtp/           # SMTP implementation
├── queue/               # RabbitMQ consumer
│   └── consumer.go     # Event-driven notification processing
├── cache/               # Caching infrastructure
│   └── dns.go          # DNS caching
├── rest/                # HTTP layer
│   ├── handlers/
│   ├── swagger/
│   └── server.go
├── config/              # Configuration
├── migrations/          # Database migrations
└── cmd/                 # Application entry points
    ├── root.go
    └── rest.go
```

## Benefits of This Architecture

1. **Testability**: Easy to mock interfaces for unit testing
2. **Maintainability**: Clear separation makes changes isolated
3. **Flexibility**: Can swap email providers easily
4. **Scalability**: Bounded contexts can become microservices
5. **Clean Dependencies**: No circular dependencies, clear flow

## API Endpoints

### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications/templates` | List all templates |
| GET | `/api/v1/notifications/templates/{id}` | Get template by ID |
| POST | `/api/v1/notifications/templates` | Create template |
| PUT | `/api/v1/notifications/templates/{id}` | Update template |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/notifications/send` | Send notification via template |
| POST | `/api/v1/notifications/email` | Send direct email |
| GET | `/api/v1/users/{id}/notifications` | Get notification history |

### User Preferences
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/{id}/notification-preferences` | Get user preferences |
| PUT | `/api/v1/users/{id}/notification-preferences` | Update preferences |

## Event-Driven Integration

Axon consumes events from RabbitMQ for async notifications:

```
RabbitMQ Exchange: bgce.events
Queue: axon-dev.notifications
```

### Consumed Events

#### User Registered → Welcome email
```json
{
  "type": "user.registered",
  "payload": {
    "user_id": 123,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Password Reset Requested → Password reset email
```json
{
  "type": "password.reset.requested",
  "payload": {
    "email": "user@example.com",
    "token": "a1b2c3d4e5f6g7h8i9j0"
  }
}
```

#### Email Verification Requested → Verification email
```json
{
  "type": "email.verification.requested",
  "payload": {
    "user_id": 123,
    "email": "user@example.com",
    "token": "verify-token-12345"
  }
}
```

#### Comment Reply Created → Reply notification
```json
{
  "type": "comment.reply.created",
  "payload": {
    "post_author_id": 456,
    "post_author_email": "author@example.com",
    "commenter_name": "Jane Doe",
    "post_title": "Getting Started with Go",
    "comment": "Great post!"
  }
}
```

#### Post Published → Follower notifications
```json
{
  "type": "post.published",
  "payload": {
    "author_name": "John Doe",
    "post_title": "Advanced Go Patterns",
    "post_slug": "advanced-go-patterns",
    "followers": [
      {"id": 1, "email": "follower1@example.com"},
      {"id": 2, "email": "follower2@example.com"}
    ]
  }
}
```

#### Course Enrolled → Enrollment confirmation
```json
{
  "type": "course.enrolled",
  "payload": {
    "user_id": 789,
    "email": "user@example.com",
    "course_name": "Mastering Microservices with Go"
  }
}
```

> See `sample-events.md` for complete event examples.

## Configuration

Environment variables (`.env`):

```env
# Server
PORT=3001
MODE=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=axon_db

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@127.0.0.1:25672

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

## Quick Start

### With Docker Compose
```bash
docker-compose up -d
go run main.go rest
```

### Local Development
```bash
# Start dependencies
docker-compose up -d postgres redis rabbitmq

# Run service
go run main.go rest
```

Service available at: `http://localhost:3001`
Swagger UI: `http://localhost:3001/swagger`

## Comparison with Skeleton Template

| Aspect | Skeleton | Axon |
|--------|----------|------|
| Port/Adapter | ✅ Yes | ✅ Yes |
| Bounded Contexts | ✅ Yes | ✅ Yes (notification, template) |
| Interface Segregation | ✅ Yes | ✅ Yes (port.go files) |
| Repository Pattern | ✅ Yes | ✅ Yes |
| Service Layer | ✅ Yes | ✅ Yes |
| Event-Driven | ✅ Yes | ✅ RabbitMQ consumer |

## Future Enhancements

1. **Push Notifications**: Mobile push support
2. **SMS Provider**: Twilio integration
3. **In-App Notifications**: Real-time WebSocket notifications
4. **Notification Templates UI**: Admin interface for templates
5. **Analytics**: Notification tracking and metrics

## Development Guidelines

### Adding a New Notification Type

1. **Add type constant** in `domain/notification.go`
2. **Create template** in database or via API
3. **Handle event** in `queue/consumer.go` if event-driven

### Adding a New Email Provider

1. **Implement** `email.Provider` interface
2. **Add provider** to `email.NewProvider()` factory
3. **Add config** in `config/`

## References

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
