# 05 | Database Migration Strategy for Microservices

### Recommended Approach: Monolithic Database with Service Boundaries

**Architecture**: Single PostgreSQL database, logically organized by domain

```
PostgreSQL Instance (Port 5432)
Database: bgce_archive
│
├── CORE DOMAIN (Cortex Service owns)
│   ├── tenants
│   ├── users
│   └── categories
│
├── CONTENT DOMAIN (Postal Service owns)
│   ├── posts
│   ├── post_versions
│   └── tags
│
├── COMMUNITY DOMAIN (Community Service owns)
│   ├── comments
│   ├── discussions
│   ├── discussion_replies
│   ├── likes
│   ├── follows
│   └── notifications
│
├── LEARNING DOMAIN (Learning Service owns)
│   ├── courses
│   ├── course_modules
│   ├── course_enrollments
│   ├── cheatsheets
│   ├── learning_paths
│   └── certifications
│
├── COMPETITION DOMAIN (Competition Service owns)
│   ├── competitions
│   ├── competition_participants
│   ├── competition_submissions
│   ├── competition_leaderboards
│   ├── competition_test_cases
│   ├── coding_challenges
│   └── challenge_submissions
│
├── CAREER DOMAIN (Jobs/Portfolio Services own)
│   ├── jobs
│   ├── job_applications
│   ├── portfolios
│   ├── projects
│   └── user_skills
│
├── DATA DOMAIN (Dataset/Model Services own)
│   ├── datasets
│   └── models
│
├── COMMUNICATION DOMAIN (Newsletter Service owns)
│   ├── newsletters
│   └── newsletter_subscriptions
│
├── SUPPORT DOMAIN (Support Service owns)
│   ├── support_tickets
│   ├── support_ticket_replies
│   └── moderation_strategies
│
├── AI DOMAIN (AI Service owns)
│   ├── ai_conversations
│   ├── ai_messages
│   ├── ai_code_reviews
│   └── content_recommendations
│
└── ANALYTICS DOMAIN (Analytics Service owns)
    ├── post_views
    ├── tenant_stats
    ├── activity_logs
    ├── media_files
    └── search_index
```

**Connection String (All Services)**:
```bash
postgresql://user:pass@localhost:5432/bgce_archive
```

### Why This Works

**Pros**:
- ✅ Maintains referential integrity with foreign keys
- ✅ ACID transactions across domains
- ✅ Efficient joins for complex queries
- ✅ Simple infrastructure (one database to manage)
- ✅ No distributed transaction complexity
- ✅ Easy local development
- ✅ Lower operational overhead
- ✅ Cost-effective

**Cons**:
- ⚠️ Services share database connection pool
- ⚠️ Schema changes require coordination
- ⚠️ Single point of failure (mitigated with replicas)
- ⚠️ Harder to scale individual services independently

### Service Ownership Model

**Each service owns its tables but shares the database:**

```go
// Cortex Service - Owns core tables
// Can read/write: users, tenants, categories
// Can read only: posts (for user's posts), comments (for moderation)

// Postal Service - Owns content tables  
// Can read/write: posts, post_versions, tags
// Can read only: users (for author info), categories (for categorization)

// Community Service - Owns community tables
// Can read/write: comments, discussions, likes, follows
// Can read only: users, posts (for commenting)
```

### Scaling Strategy

**Phase 1: Single Instance (0-10K users)**
```
PostgreSQL Primary (Port 5432)
├── All services connect here
└── Regular backups
```

**Phase 2: Read Replicas (10K-100K users)**
```
PostgreSQL Primary (Port 5432) - Write operations
├── Cortex (writes)
├── Postal (writes)
└── Community (writes)

PostgreSQL Replica 1 (Port 5433) - Read operations
├── Postal (reads - high traffic)
└── Community (reads - high traffic)

PostgreSQL Replica 2 (Port 5434) - Read operations
├── Learning (reads)
├── Competition (reads)
└── Analytics (reads)
```

**Phase 3: Partitioning (100K+ users)**
```
PostgreSQL Primary (Port 5432)
├── Partition by tenant_id (multi-tenancy)
├── Partition by date (time-series data)
└── Separate tablespaces for hot/cold data
```

**Phase 4: Citus Extension (1M+ users)**
```
Citus Coordinator (Port 5432)
├── Distributed tables by tenant_id
├── Reference tables (users, categories) replicated
└── Worker nodes for horizontal scaling
```

---

## Migration Management

### Current Problems

**Cortex (Ent ORM)**:
```go
// Auto-migration on startup - NO VERSION CONTROL
client.Schema.Create(ctx)
```

**Postal (GORM)**:
```go
// Auto-migration - NO ROLLBACK SUPPORT
db.AutoMigrate(&domain.Post{}, &domain.PostVersion{})
```

**Issues**:
- ❌ No migration history
- ❌ No rollback capability
- ❌ Schema drift between environments
- ❌ Difficult to coordinate deployments
- ❌ No audit trail
- ❌ Dangerous in production

---

### Recommended Solution: golang-migrate

**Tool**: https://github.com/golang-migrate/migrate

**Features**:
- ✅ Versioned migrations (up/down)
- ✅ Multiple database support
- ✅ CLI and Go library
- ✅ Rollback support
- ✅ Dirty state detection
- ✅ Production-ready

### Migration File Structure

**Per-Service Pattern**:
```
cortex/
├── migrations/
│   ├── 000001_create_users_table.up.sql
│   ├── 000001_create_users_table.down.sql
│   ├── 000002_create_tenants_table.up.sql
│   ├── 000002_create_tenants_table.down.sql
│   ├── 000003_create_categories_table.up.sql
│   ├── 000003_create_categories_table.down.sql
│   └── 000004_add_user_skill_level.up.sql
│   └── 000004_add_user_skill_level.down.sql
├── repo/
│   └── migrate.go (migration runner)
└── main.go

postal/
├── migrations/
│   ├── 000001_create_posts_table.up.sql
│   ├── 000001_create_posts_table.down.sql
│   ├── 000002_create_post_versions_table.up.sql
│   └── 000002_create_post_versions_table.down.sql
└── repo/
    └── migrate.go
```

### Migration File Example

**000001_create_users_table.up.sql**:
```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'viewer',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    avatar_url VARCHAR(500),
    bio TEXT,
    skill_level VARCHAR(20) DEFAULT 'beginner',
    learning_goals JSONB,
    ai_preferences JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_status ON users(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**000001_create_users_table.down.sql**:
```sql
-- Drop trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_users_status;
DROP INDEX IF EXISTS idx_users_tenant_id;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Drop table
DROP TABLE IF EXISTS users;
```

---

## Implementation Guide

### Step 1: Install golang-migrate

```bash
# Install CLI
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Add to each service's go.mod
go get -u github.com/golang-migrate/migrate/v4
go get -u github.com/golang-migrate/migrate/v4/database/postgres
go get -u github.com/golang-migrate/migrate/v4/source/file
```

### Step 2: Create Migration Runner

**cortex/repo/migrate.go**:
```go
package repo

import (
    "database/sql"
    "fmt"
    "log/slog"

    "github.com/golang-migrate/migrate/v4"
    "github.com/golang-migrate/migrate/v4/database/postgres"
    _ "github.com/golang-migrate/migrate/v4/source/file"
)

type MigrationConfig struct {
    DB              *sql.DB
    MigrationsPath  string
    DatabaseName    string
}

// RunMigrations executes all pending migrations
func RunMigrations(config MigrationConfig) error {
    driver, err := postgres.WithInstance(config.DB, &postgres.Config{
        DatabaseName: config.DatabaseName,
    })
    if err != nil {
        return fmt.Errorf("failed to create migration driver: %w", err)
    }

    m, err := migrate.NewWithDatabaseInstance(
        fmt.Sprintf("file://%s", config.MigrationsPath),
        config.DatabaseName,
        driver,
    )
    if err != nil {
        return fmt.Errorf("failed to create migration instance: %w", err)
    }

    // Get current version
    version, dirty, err := m.Version()
    if err != nil && err != migrate.ErrNilVersion {
        return fmt.Errorf("failed to get migration version: %w", err)
    }

    if dirty {
        slog.Error("Database is in dirty state", "version", version)
        return fmt.Errorf("database is in dirty state at version %d", version)
    }

    slog.Info("Current migration version", "version", version)

    // Run migrations
    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        return fmt.Errorf("failed to run migrations: %w", err)
    }

    newVersion, _, _ := m.Version()
    slog.Info("Migrations completed", "new_version", newVersion)

    return nil
}

// RollbackMigration rolls back the last migration
func RollbackMigration(config MigrationConfig) error {
    driver, err := postgres.WithInstance(config.DB, &postgres.Config{
        DatabaseName: config.DatabaseName,
    })
    if err != nil {
        return fmt.Errorf("failed to create migration driver: %w", err)
    }

    m, err := migrate.NewWithDatabaseInstance(
        fmt.Sprintf("file://%s", config.MigrationsPath),
        config.DatabaseName,
        driver,
    )
    if err != nil {
        return fmt.Errorf("failed to create migration instance: %w", err)
    }

    if err := m.Steps(-1); err != nil {
        return fmt.Errorf("failed to rollback migration: %w", err)
    }

    slog.Info("Migration rolled back successfully")
    return nil
}

// MigrateToVersion migrates to a specific version
func MigrateToVersion(config MigrationConfig, version uint) error {
    driver, err := postgres.WithInstance(config.DB, &postgres.Config{
        DatabaseName: config.DatabaseName,
    })
    if err != nil {
        return fmt.Errorf("failed to create migration driver: %w", err)
    }

    m, err := migrate.NewWithDatabaseInstance(
        fmt.Sprintf("file://%s", config.MigrationsPath),
        config.DatabaseName,
        driver,
    )
    if err != nil {
        return fmt.Errorf("failed to create migration instance: %w", err)
    }

    if err := m.Migrate(version); err != nil && err != migrate.ErrNoChange {
        return fmt.Errorf("failed to migrate to version %d: %w", version, err)
    }

    slog.Info("Migrated to version", "version", version)
    return nil
}
```

### Step 3: Update Service Initialization

**cortex/main.go** (or cmd/rest.go):
```go
package main

import (
    "cortex/config"
    "cortex/repo"
    "database/sql"
    "log"
    "log/slog"
    "path/filepath"

    _ "github.com/lib/pq"
)

func main() {
    // Load config
    cfg := config.LoadConfig()

    // Ensure database exists
    if err := config.EnsureDatabaseExists("postgres", cfg.DatabaseDSN); err != nil {
        log.Fatal("Failed to ensure database exists:", err)
    }

    // Connect to database
    db, err := sql.Open("postgres", cfg.DatabaseDSN)
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    defer db.Close()

    // Run migrations
    migrationsPath := filepath.Join(".", "migrations")
    if err := repo.RunMigrations(repo.MigrationConfig{
        DB:             db,
        MigrationsPath: migrationsPath,
        DatabaseName:   "cortex_db",
    }); err != nil {
        log.Fatal("Failed to run migrations:", err)
    }

    slog.Info("Database migrations completed successfully")

    // Continue with rest of initialization...
    // Start HTTP server, etc.
}
```

### Step 4: Create Makefile Commands

**cortex/Makefile**:
```makefile
# Database migrations
.PHONY: migrate-up migrate-down migrate-create migrate-force migrate-version

migrate-up:
	@echo "Running migrations..."
	migrate -path ./migrations -database "$(DATABASE_URL)" up

migrate-down:
	@echo "Rolling back last migration..."
	migrate -path ./migrations -database "$(DATABASE_URL)" down 1

migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir ./migrations -seq $$name

migrate-force:
	@read -p "Enter version to force: " version; \
	migrate -path ./migrations -database "$(DATABASE_URL)" force $$version

migrate-version:
	@migrate -path ./migrations -database "$(DATABASE_URL)" version

# Example: make migrate-create name=add_user_avatar
```

### Step 5: CI/CD Integration

**GitHub Actions Workflow** (.github/workflows/migrate.yml):
```yaml
name: Database Migrations

on:
  push:
    branches: [main, develop]
    paths:
      - 'cortex/migrations/**'
      - 'postal/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Install golang-migrate
        run: |
          curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
          sudo mv migrate /usr/local/bin/
          
      - name: Run Cortex migrations
        run: |
          migrate -path ./cortex/migrations \
                  -database "postgresql://postgres:postgres@localhost:5432/cortex_db?sslmode=disable" \
                  up
                  
      - name: Run Postal migrations
        run: |
          migrate -path ./postal/migrations \
                  -database "postgresql://postgres:postgres@localhost:5432/postal_db?sslmode=disable" \
                  up
```

---

## Migration Best Practices

### 1. Always Write Down Migrations

Every `.up.sql` must have a corresponding `.down.sql` for rollback.

### 2. Make Migrations Idempotent

```sql
-- Good: Idempotent
CREATE TABLE IF NOT EXISTS users (...);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Bad: Will fail on re-run
CREATE TABLE users (...);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Never Modify Existing Migrations

Once a migration is merged to main, never edit it. Create a new migration instead.

```bash
# Wrong: Editing 000001_create_users.up.sql

# Right: Creating new migration
migrate create -ext sql -dir ./migrations -seq add_user_avatar_column
```

### 4. Test Migrations Locally

```bash
# Apply migration
make migrate-up

# Test rollback
make migrate-down

# Re-apply
make migrate-up
```

### 5. Use Transactions for Data Migrations

```sql
-- 000005_migrate_user_data.up.sql
BEGIN;

UPDATE users SET skill_level = 'beginner' WHERE skill_level IS NULL;

COMMIT;
```

### 6. Add Indexes Concurrently in Production

```sql
-- For large tables, use CONCURRENTLY to avoid locking
CREATE INDEX CONCURRENTLY idx_posts_category_id ON posts(category_id);
```

### 7. Handle Schema vs Data Migrations Separately

```
000001_create_users_table.up.sql       -- Schema
000002_seed_default_users.up.sql       -- Data
000003_add_user_avatar_column.up.sql   -- Schema
000004_migrate_user_avatars.up.sql     -- Data
```

---

## Cross-Service Data Access

### Advantage: Direct Database Joins Work!

With a shared database, you can do efficient joins:

```sql
-- This works perfectly!
SELECT 
    p.id,
    p.title,
    p.slug,
    p.content,
    u.username AS author_name,
    u.avatar_url AS author_avatar,
    c.label AS category_name
FROM posts p
INNER JOIN users u ON p.created_by = u.id
INNER JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
ORDER BY p.created_at DESC
LIMIT 20;
```

### Service Access Patterns

**Pattern 1: Direct Database Access (Within Service)**

Each service can directly query its own tables and read from shared tables:

```go
// Postal Service - Get posts with author info
func (r *PostRepository) GetPostsWithAuthors(limit int) ([]PostWithAuthor, error) {
    query := `
        SELECT 
            p.id, p.title, p.slug, p.content,
            u.id as author_id, u.username, u.avatar_url
        FROM posts p
        INNER JOIN users u ON p.created_by = u.id
        WHERE p.status = 'published'
        ORDER BY p.created_at DESC
        LIMIT $1
    `
    
    rows, err := r.db.Query(query, limit)
    // ... process results
}
```

**Pattern 2: API Calls for Write Operations**

Services should use APIs for write operations to other domains:

```go
// Community Service - Create comment
func (s *CommentService) CreateComment(req CreateCommentRequest) error {
    // Validate post exists via Postal API
    post, err := s.postalClient.GetPost(req.PostID)
    if err != nil {
        return fmt.Errorf("post not found: %w", err)
    }
    
    // Validate user exists via Cortex API
    user, err := s.cortexClient.GetUser(req.UserID)
    if err != nil {
        return fmt.Errorf("user not found: %w", err)
    }
    
    // Create comment in database (foreign keys will validate)
    comment := &Comment{
        PostID:  req.PostID,
        UserID:  req.UserID,
        Content: req.Content,
    }
    
    return s.repo.Create(comment)
}
```

**Pattern 3: Event-Driven Updates**

Use events for cache invalidation and denormalization:

```go
// When user updates profile in Cortex
func (s *UserService) UpdateProfile(userID int, updates UserUpdates) error {
    // Update database
    if err := s.repo.Update(userID, updates); err != nil {
        return err
    }
    
    // Publish event for other services
    event := Event{
        Type: "user.profile.updated",
        Payload: map[string]interface{}{
            "user_id": userID,
            "username": updates.Username,
            "avatar_url": updates.AvatarURL,
        },
    }
    s.eventBus.Publish("cortex.user.updated", event)
    
    return nil
}

// Postal Service listens and invalidates cache
func (s *PostService) HandleUserUpdated(event Event) {
    userID := event.Payload["user_id"].(int)
    
    // Invalidate cached posts by this author
    s.cache.Delete(fmt.Sprintf("user:%d:posts", userID))
    
    // Invalidate Redis cache
    s.redis.Del(fmt.Sprintf("author:%d", userID))
}
```

### Access Control Rules

**Cortex Service (Core Domain Owner)**:
- ✅ Full access: `users`, `tenants`, `categories`
- ✅ Read access: All tables (for admin/moderation)
- ❌ Write access: Other service tables (use APIs)

**Postal Service (Content Domain Owner)**:
- ✅ Full access: `posts`, `post_versions`, `tags`, `post_tags`
- ✅ Read access: `users`, `categories` (for joins)
- ❌ Write access: `users`, `categories` (use Cortex API)

**Community Service (Community Domain Owner)**:
- ✅ Full access: `comments`, `discussions`, `discussion_replies`, `likes`, `follows`, `notifications`
- ✅ Read access: `users`, `posts`, `categories` (for joins)
- ❌ Write access: `users`, `posts` (use APIs)

**Learning Service (Learning Domain Owner)**:
- ✅ Full access: `courses`, `course_modules`, `course_enrollments`, `cheatsheets`, `learning_paths`, `certifications`
- ✅ Read access: `users`, `categories` (for joins)
- ❌ Write access: `users`, `categories` (use APIs)

### Database User Permissions

Create separate database users per service with appropriate permissions:

```sql
-- Cortex user (full access to core tables)
CREATE USER cortex_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON TABLE users, tenants, categories TO cortex_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cortex_user;

-- Postal user (full access to content tables, read-only on core)
CREATE USER postal_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON TABLE posts, post_versions, tags, post_tags TO postal_user;
GRANT SELECT ON TABLE users, categories TO postal_user;

-- Community user (full access to community tables, read-only on others)
CREATE USER community_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON TABLE comments, discussions, discussion_replies, likes, follows, notifications TO community_user;
GRANT SELECT ON TABLE users, posts, categories TO community_user;

-- Learning user (full access to learning tables, read-only on core)
CREATE USER learning_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON TABLE courses, course_modules, course_enrollments, cheatsheets, learning_paths, certifications TO learning_user;
GRANT SELECT ON TABLE users, categories TO learning_user;
```

### Connection Pooling Strategy

Each service maintains its own connection pool:

```go
// Cortex Service
cortexDB, err := sql.Open("postgres", 
    "postgresql://cortex_user:pass@localhost:5432/bgce_archive?pool_max_conns=50")

// Postal Service
postalDB, err := sql.Open("postgres", 
    "postgresql://postal_user:pass@localhost:5432/bgce_archive?pool_max_conns=30")

// Community Service
communityDB, err := sql.Open("postgres", 
    "postgresql://community_user:pass@localhost:5432/bgce_archive?pool_max_conns=40")
```

---

## Monitoring & Observability

### Track Migration Status

**Create monitoring table**:
```sql
CREATE TABLE migration_history (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    execution_time_ms INTEGER,
    success BOOLEAN NOT NULL
);
```

### Prometheus Metrics

```go
var (
    migrationDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "db_migration_duration_seconds",
            Help: "Time taken to run migrations",
        },
        []string{"service", "version"},
    )
)
```

### Alerting

```yaml
# Alert if migration fails
- alert: MigrationFailed
  expr: db_migration_success == 0
  for: 1m
  annotations:
    summary: "Database migration failed for {{ $labels.service }}"
```

---

## Rollback Strategy

### Automated Rollback

```bash
# If deployment fails, automatically rollback migration
if ! ./deploy.sh; then
    echo "Deployment failed, rolling back migration..."
    make migrate-down
    exit 1
fi
```

### Manual Rollback

```bash
# Check current version
make migrate-version

# Rollback to specific version
migrate -path ./migrations -database "$DATABASE_URL" force 3
```

### Zero-Downtime Migrations

**Expand-Contract Pattern**:

**Phase 1: Expand** (Add new column, keep old)
```sql
-- Migration 000010
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
```

**Phase 2: Dual Write** (Write to both columns)
```go
// Application code writes to both
user.EmailVerified = true
user.LegacyEmailStatus = "verified"
```

**Phase 3: Migrate Data**
```sql
-- Migration 000011
UPDATE users SET email_verified = (legacy_email_status = 'verified');
```

**Phase 4: Contract** (Remove old column)
```sql
-- Migration 000012
ALTER TABLE users DROP COLUMN legacy_email_status;
```

---

## Summary & Recommendations

### Final Architecture Decision

**✅ RECOMMENDED: Monolithic Database with Service Boundaries**

Given your highly relational schema with 50+ tables and extensive foreign key relationships, a shared database is the pragmatic choice.

**Why This Works for Your Platform**:
1. **Referential Integrity**: Foreign keys enforce data consistency
2. **Performance**: Efficient joins without network calls
3. **Simplicity**: One database to manage, backup, and monitor
4. **ACID Transactions**: Cross-domain operations are atomic
5. **Cost-Effective**: Lower infrastructure costs
6. **Developer Experience**: Easier local development and testing

**Service Boundaries Without Database Separation**:
- Each service owns specific tables (logical ownership)
- Services use separate database users with restricted permissions
- Write operations to other domains go through APIs
- Read operations can use direct database joins
- Events for cache invalidation and notifications

### Migration Strategy

**Immediate Actions (Week 1-2)**:

1. ✅ Install golang-migrate in all services
2. ✅ Create centralized migrations directory structure:
   ```
   migrations/
   ├── cortex/
   │   ├── 000001_create_users.up.sql
   │   └── 000001_create_users.down.sql
   ├── postal/
   │   ├── 000001_create_posts.up.sql
   │   └── 000001_create_posts.down.sql
   └── community/
       ├── 000001_create_comments.up.sql
       └── 000001_create_comments.down.sql
   ```
3. ✅ Generate initial migrations from current schemas
4. ✅ Create database users per service with appropriate permissions
5. ✅ Update service initialization to run migrations

**Short-term (Month 1-2)**:

1. ✅ Migrate Cortex from Ent auto-migration to explicit migrations
2. ✅ Migrate Postal from GORM AutoMigrate to explicit migrations
3. ✅ Set up CI/CD pipeline for migration testing
4. ✅ Document migration workflow and conventions
5. ✅ Create Makefile commands for common migration tasks

**Medium-term (Month 3-6)**:

1. ✅ Implement all 50+ tables with proper foreign keys
2. ✅ Set up read replicas for scaling read operations
3. ✅ Implement connection pooling per service
4. ✅ Set up monitoring for database performance
5. ✅ Create migration templates for new services

**Long-term (Month 6-12)**:

1. ✅ Implement table partitioning for large tables (posts, analytics)
2. ✅ Set up automated backup and point-in-time recovery
3. ✅ Consider Citus extension for horizontal scaling (if needed)
4. ✅ Optimize indexes based on query patterns
5. ✅ Implement database connection pooling with PgBouncer

### When to Reconsider Database Separation

You should only consider splitting databases if:

1. **Scale**: You reach 1M+ users and single database becomes bottleneck
2. **Team Size**: You have 50+ engineers and coordination overhead is high
3. **Compliance**: Regulatory requirements mandate data isolation
4. **Technology**: You need different database technologies per domain (e.g., MongoDB for some services)

Even then, consider these alternatives first:
- Read replicas for read scaling
- Table partitioning for data management
- Citus extension for horizontal scaling
- Connection pooling with PgBouncer
- Vertical scaling (bigger instance)

### Alternative: Hybrid Approach (Future Consideration)

If you eventually need to split, do it selectively:

**Keep in Shared Database** (high relational coupling):
- Core domain: users, tenants, categories
- Content domain: posts, comments, discussions
- Learning domain: courses, enrollments
- Community domain: likes, follows, notifications

**Move to Separate Databases** (low coupling):
- Analytics domain: post_views, activity_logs (time-series data)
- Media domain: media_files (large binary data)
- AI domain: ai_conversations, ai_messages (high volume)
- Search domain: search_index (could use Elasticsearch instead)

### Migration Coordination Strategy

**Centralized Migration Management**:

Create a migration orchestrator that runs all service migrations in dependency order:

```bash
#!/bin/bash
# scripts/run-all-migrations.sh

set -e

echo "Running database migrations..."

# Phase 1: Core tables (no dependencies)
echo "Phase 1: Core domain (Cortex)"
migrate -path ./migrations/cortex -database "$DATABASE_URL" up

# Phase 2: Tables depending on core
echo "Phase 2: Content domain (Postal)"
migrate -path ./migrations/postal -database "$DATABASE_URL" up

echo "Phase 3: Community domain (Community)"
migrate -path ./migrations/community -database "$DATABASE_URL" up

# Phase 3: All other domains
echo "Phase 4: Learning domain (Learning)"
migrate -path ./migrations/learning -database "$DATABASE_URL" up

echo "Phase 5: Competition domain (Competition)"
migrate -path ./migrations/competition -database "$DATABASE_URL" up

echo "Phase 6: Career domain (Jobs/Portfolio)"
migrate -path ./migrations/career -database "$DATABASE_URL" up

echo "Phase 7: Support domain (Support)"
migrate -path ./migrations/support -database "$DATABASE_URL" up

echo "Phase 8: Analytics domain (Analytics)"
migrate -path ./migrations/analytics -database "$DATABASE_URL" up

echo "✅ All migrations completed successfully"
```

**CI/CD Integration**:

```yaml
# .github/workflows/database-migrations.yml
name: Database Migrations

on:
  push:
    branches: [main, develop]
    paths:
      - 'migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run all migrations
        run: |
          chmod +x scripts/run-all-migrations.sh
          ./scripts/run-all-migrations.sh
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Decision Matrix

| Scenario | Recommendation |
|----------|---------------|
| **Database architecture** | Single PostgreSQL database, all services connect |
| **Schema organization** | Logical domains, physical shared database |
| **Foreign keys** | ✅ Use them! Enforce referential integrity |
| **Migration tool** | golang-migrate (explicit, versioned) |
| **Migration coordination** | Centralized script runs migrations in dependency order |
| **Cross-service reads** | Direct database joins (efficient) |
| **Cross-service writes** | API calls (maintain service boundaries) |
| **Scaling strategy** | Read replicas → Partitioning → Citus (if needed) |
| **Database users** | Separate user per service with restricted permissions |
| **Connection pooling** | Per-service pools + PgBouncer for connection management |

---

**Document Version**: 2.0 (Revised based on schema analysis)  
**Last Updated**: February 2026  
**Owner**: Engineering & DevOps Teams  
**Status**: Approved for Implementation  
**Key Change**: Shifted from database-per-service to shared database due to extensive foreign key relationships
