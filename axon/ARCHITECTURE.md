# Axon Service - Clean Architecture

## Architecture Overview

The Axon service follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles, properly separating concerns across layers.

## Directory Structure

```
axon/
├── domain/              # Pure domain entities (no dependencies)
│   ├── notification.go
│   └── template.go
│
├── notification/        # Notification bounded context (business logic)
│   ├── port.go         # Service & Repository interfaces
│   └── service.go      # Business logic implementation
│
├── template/            # Template bounded context
│   └── port.go         # Repository interface
│
├── repo/                # Infrastructure - Data persistence
│   ├── migrate.go
│   ├── notification_repository.go
│   ├── template_repository.go
│   └── preference_repository.go
│
├── cache/               # Infrastructure - Generic caching
│   ├── cache.go        # Cache interface & constructor
│   ├── client.go       # Redis client setup
│   ├── dns.go          # DNS caching
│   ├── set.go          # Set operation
│   ├── get.go          # Get operation
│   ├── del.go          # Delete operation
│   └── key_exists.go   # Exists check
│
├── email/               # Infrastructure - Email providers
│   ├── provider.go     # Provider interface & factory
│   └── smtp/           # SMTP implementation
│
├── queue/               # Infrastructure - Message queue
│   └── consumer.go     # RabbitMQ consumer
│
├── rest/                # Presentation layer
│   ├── handlers/       # HTTP handlers
│   ├── swagger/        # OpenAPI documentation
│   ├── server.go       # HTTP server setup
│   └── utils/          # Validation
│
├── config/              # Configuration management
│   ├── config.go
│   ├── db_config.go
│   └── load-config.go
│
├── migrations/          # Database migrations
│   ├── 000001_create_notifications_table.up.sql
│   ├── 000001_create_notifications_table.down.sql
│   ├── 000002_create_templates_table.up.sql
│   ├── 000002_create_templates_table.down.sql
│   ├── 000003_create_user_preferences_table.up.sql
│   └── 000003_create_user_preferences_table.down.sql
│
└── cmd/                 # Application entry points
    ├── root.go
    └── rest.go         # Dependency injection & wiring
```

## Layer Responsibilities

### 1. Domain Layer (`domain/`)
**Pure business entities with zero external dependencies**

- Contains only domain models and business rules
- No imports from other layers
- Framework-agnostic
- Example: `Notification`, `Template`, `UserPreference`, `NotificationType`

```go
// domain/notification.go
type Notification struct {
    ID         uint
    UserID     uint
    Type       NotificationType
    Subject    string
    Body       string
    Recipient  string
    Status     NotificationStatus
    // ... business fields
}
```

### 2. Application Layer (Bounded Contexts)

#### `notification/` - Notification Bounded Context
- **`port.go`**: Defines interfaces (Service, Repository)
- **`service.go`**: Business logic implementation

```go
// notification/port.go
type Service interface {
    SendNotification(ctx, req) error
    GetUserPreferences(ctx, userID) (*UserPreference, error)
    UpdateUserPreferences(ctx, pref) error
    GetNotificationHistory(ctx, userID) ([]Notification, error)
}

type Repository interface {
    Create(ctx, notification) error
    GetByUserID(ctx, userID) ([]Notification, error)
    // ... other methods
}
```

```go
// notification/service.go
func NewService(repo Repository, prefRepo PreferenceRepository, 
    templateRepo TemplateRepository, email email.Provider, cache cache.Cache) Service {
    return &service{repo, prefRepo, templateRepo, email, cache}
}
```

**Key Principle**: Service implements caching logic using generic cache primitives

```go
// Service uses cache.Set/Get, NOT cache.SetNotification/GetNotification
func (s *service) GetUserPreferences(ctx context.Context, userID uint) (*UserPreference, error) {
    // Try cache
    cacheKey := fmt.Sprintf("user:preferences:%d", userID)
    cached, _ := s.cache.Get(ctx, cacheKey)
    if cached != "" {
        // unmarshal and return
    }
    
    // Load from DB
    pref, _ := s.prefRepo.GetByUserID(ctx, userID)
    
    // Cache it
    data, _ := json.Marshal(pref)
    s.cache.Set(ctx, cacheKey, data, 24*time.Hour)
    
    return pref, nil
}
```

#### `template/` - Template Bounded Context
- **`port.go`**: Repository interface only (no service needed)

### 3. Infrastructure Layer

#### `repo/` - Data Persistence
**All repository implementations live here**

- `notification_repository.go` - Implements `notification.Repository`
- `template_repository.go` - Implements `template.Repository`
- `preference_repository.go` - Implements preference repository
- Uses GORM for database operations
- Handles transactions, queries, migrations

```go
// repo/notification_repository.go
type notificationRepository struct {
    db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) notification.Repository {
    return &notificationRepository{db}
}
```

#### `cache/` - Generic Caching
**Provides primitive cache operations, NOT domain-specific methods**

```go
// cache/cache.go
type Cache interface {
    Set(ctx, key, value, expiration) error
    Get(ctx, key) (string, error)
    Del(ctx, keys...) error
    Exists(ctx, keys...) (int64, error)
}
```

**WRONG** ❌:
```go
type Cache interface {
    SetNotification(ctx, notification) error      // Domain-specific!
    GetNotificationByID(ctx, id) (*Notification, error)  // Domain-specific!
}
```

**RIGHT** ✅:
```go
type Cache interface {
    Set(ctx, key, value, ttl) error      // Generic!
    Get(ctx, key) (string, error)        // Generic!
}
```

#### `email/` - Email Provider
**Provides email sending abstraction**

```go
// email/provider.go
type Provider interface {
    Send(ctx, to, subject, htmlBody, textBody) error
    GetName() string
}

func NewProvider() (Provider, error) {
    // Factory based on config
}
```

#### `queue/` - Message Queue Consumer
**Consumes events from RabbitMQ for async notifications**

```go
// queue/consumer.go
type Consumer struct {
    conn    *amqp.Connection
    channel *amqp.Channel
    service notification.Service
}

func NewConsumer(url, queueName string, svc notification.Service) (*Consumer, error)
```

### 4. Presentation Layer (`rest/`)
- HTTP handlers
- Request validation
- Response formatting
- Swagger documentation

### 5. Configuration (`config/`)
- Environment variables
- Database connection
- Service configuration

### 6. Entry Point (`cmd/`)
**Dependency injection and wiring**

```go
// cmd/rest.go
func runRESTServer() error {
    // 1. Load config
    cfg := config.LoadConfig()
    
    // 2. Initialize infrastructure
    db := config.InitDatabase(cfg)
    redisClient := cache.NewRedisClient(cfg.WriteRedisURL)
    
    // 3. Initialize repositories (adapters)
    notificationRepo := repo.NewNotificationRepository(db)
    templateRepo := repo.NewTemplateRepository(db)
    prefRepo := repo.NewPreferenceRepository(db)
    cacheClient := cache.NewCache(redisClient, redisClient)
    
    // 4. Initialize email provider
    emailProvider, _ := email.NewProvider()
    
    // 5. Initialize services (use cases)
    notificationService := notification.NewService(
        notificationRepo, prefRepo, templateRepo, emailProvider, cacheClient,
    )
    
    // 6. Initialize handlers (controllers)
    notificationHandler := handlers.NewNotificationHandler(notificationService)
    templateHandler := handlers.NewTemplateHandler(templateRepo)
    
    // 7. Start consumer in background
    go func() {
        consumer, _ := queue.NewConsumer(cfg.RabbitMQURL, cfg.QueueName, notificationService)
        consumer.Start(ctx, cfg.QueueName)
    }()
    
    // 8. Start server
    server := rest.NewServer(cfg.HTTPPort, notificationHandler, templateHandler)
    return server.Start()
}
```

## Dependency Flow

```
┌─────────────────────────────────────────────────┐
│                   cmd/rest.go                   │
│            (Dependency Injection)               │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌────────┐
   │  REST  │  │ Service │  │  Repo  │
   │Handlers│─▶│(notify) │─▶│  (DB)  │
   └────────┘  └─────────┘  └────────┘
        │            │
        │            ├──────────▶ ┌────────┐
        │            │            │ Cache  │
        │            │            │(Redis) │
        │            │            └────────┘
        │            │
        │            └──────────▶ ┌────────┐
        │                         │ Email  │
        │                         │Provider│
        │                         └────────┘
        │
        └──────────────────────▶ ┌────────┐
                                 │ Queue  │
                                 │Consumer│
                                 └────────┘
```

**Dependencies point INWARD**:
- Handlers depend on Service interface
- Service depends on Repository, Cache & Email interfaces
- Implementations (repo, cache, email) depend on nothing

## Key Principles Applied

### 1. Separation of Concerns
- **Domain**: Business rules
- **Service**: Use cases & orchestration
- **Repository**: Data access
- **Cache**: Performance optimization
- **Email Provider**: External service abstraction
- **Queue Consumer**: Async event processing
- **Handlers**: HTTP concerns

### 2. Dependency Inversion
```go
// Service depends on interface (port)
type service struct {
    repo         Repository      // interface, not concrete type
    prefRepo     PreferenceRepository
    templateRepo TemplateRepository
    email        email.Provider  // interface
    cache        cache.Cache     // interface
}

// Repository implementation (adapter)
type notificationRepository struct {
    db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) Repository {  // Returns interface
    return &notificationRepository{db}
}
```

### 3. Interface Segregation
Each bounded context defines its own interfaces in `port.go`:
- `notification.Service` - Business operations
- `notification.Repository` - Data operations
- `template.Repository` - Template operations

### 4. Single Responsibility
- **Cache layer**: Generic operations only
- **Email layer**: Email sending abstraction
- **Service layer**: Implements domain-specific caching logic
- **Repository layer**: Database operations only

### 5. Ports and Adapters (Hexagonal Architecture)
```
Application Core (notification/)
    ↓ depends on
Ports (interfaces in port.go)
    ↑ implemented by
Adapters (repo/, cache/, email/)
```

## Event-Driven Integration

Axon consumes events from RabbitMQ for async notifications:

```
RabbitMQ Exchange: bgce.events
Queue: axon-dev.notifications

Consumed Events:
- user.registered          → Welcome email
- password.reset.requested → Password reset email
- email.verification.requested → Verification email
- comment.reply.created    → Reply notification
- post.published           → Follower notifications
- course.enrolled          → Enrollment confirmation
```

## Testing Strategy

### Unit Tests
Mock interfaces from `port.go`:
```go
type mockRepository struct{}
func (m *mockRepository) Create(ctx, n) error {
    return nil
}

type mockEmailProvider struct{}
func (m *mockEmailProvider) Send(ctx, to, subject, html, text) error {
    return nil
}

func TestSendNotification(t *testing.T) {
    mockRepo := &mockRepository{}
    mockEmail := &mockEmailProvider{}
    mockCache := &mockCache{}
    svc := notification.NewService(mockRepo, nil, nil, mockEmail, mockCache)
    
    err := svc.SendNotification(ctx, req)
    // assertions
}
```

### Integration Tests
Use test database and real implementations

### E2E Tests
Full HTTP stack with test server

## Benefits

1. **Testability**: Easy to mock interfaces
2. **Maintainability**: Clear boundaries, isolated changes
3. **Flexibility**: Swap implementations (GORM → sqlx, SMTP → SendGrid)
4. **Scalability**: Bounded contexts can become microservices
5. **Clean Dependencies**: No circular dependencies

## Comparison with Postal Service

| Aspect | Postal | Axon |
|--------|--------|------|
| Port/Adapter Pattern | ✅ | ✅ |
| Bounded Contexts | ✅ | ✅ |
| Repo in `repo/` | ✅ | ✅ |
| Generic Cache | ✅ | ✅ |
| Service Implements Cache Logic | ✅ | ✅ |
| Interface Segregation | ✅ | ✅ |
| Clean Dependencies | ✅ | ✅ |
| Email Provider Abstraction | ❌ | ✅ |
| Event-Driven Consumer | ❌ | ✅ |

## Common Mistakes to Avoid

### ❌ Domain-Specific Cache Methods
```go
// WRONG - Cache knows about Notification
type Cache interface {
    SetNotification(ctx, notification) error
    GetNotificationByID(ctx, id) (*Notification, error)
}
```

### ✅ Generic Cache Methods
```go
// RIGHT - Cache is generic
type Cache interface {
    Set(ctx, key, value, ttl) error
    Get(ctx, key) (string, error)
}

// Service implements caching logic
func (s *service) GetUserPreferences(ctx, userID) {
    key := fmt.Sprintf("user:preferences:%d", userID)
    cached, _ := s.cache.Get(ctx, key)
    // ... unmarshal, etc
}
```

### ❌ Repository in Domain Directory
```
notification/
├── repository.go  ❌ WRONG
└── service.go
```

### ✅ Repository in Repo Directory
```
repo/
├── notification_repository.go  ✅ RIGHT
├── template_repository.go
└── preference_repository.go

notification/
├── port.go       # Defines Repository interface
└── service.go    # Business logic
```

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
