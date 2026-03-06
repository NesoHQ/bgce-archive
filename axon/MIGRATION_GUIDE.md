

Here's the updated [MIGRATION_GUIDE.md](cci:7://file:///d:/Codes/bgce-archive/axon/MIGRATION_GUIDE.md:0:0-0:0) for Axon:

```markdown
# Database Migration Implementation Guide (Axon Service)

This document describes the implementation of database version control for the **Axon Notification Service** using:

* golang-migrate

---

## Overview

Axon uses **versioned SQL migrations** for managing notification-related tables.

---

## What Changed

### Before (GORM Auto Migration)

```go
// Auto-migration - NO ROLLBACK SUPPORT
db.AutoMigrate(&domain.Notification{}, &domain.Template{}, &domain.UserPreference{})
```

### Problems

* ❌ No migration version control
* ❌ No rollback capability
* ❌ No migration history
* ❌ Schema drift between environments

---

### After (golang-migrate)

Axon now uses:

* ✅ Versioned `.up.sql` / `.down.sql`
* ✅ Rollback capability
* ✅ Migration history tracking
* ✅ Dirty state recovery
* ✅ Production-safe schema evolution

---

# Directory Structure (Axon)

```
axon/
├── migrations/
│   ├── README.md
│   ├── 000001_create_notifications_table.up.sql
│   ├── 000001_create_notifications_table.down.sql
│   ├── 000002_create_templates_table.up.sql
│   ├── 000002_create_templates_table.down.sql
│   ├── 000003_create_user_preferences_table.up.sql
│   └── 000003_create_user_preferences_table.down.sql
├── repo/
│   ├── migrate.go
│   ├── notification_repository.go
│   ├── template_repository.go
│   └── preference_repository.go
└── Makefile
```

---

# Installation

## 1️⃣ Install golang-migrate CLI

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

Dependencies already added:

* `github.com/golang-migrate/migrate/v4`
* `github.com/golang-migrate/migrate/v4/database/postgres`
* `github.com/golang-migrate/migrate/v4/source/file`

---

# Database Configuration

Check your `.env`:

```env
AXON_DB_DSN=postgresql://postgres:postgres@localhost:5432/axon_db?sslmode=disable
AXON_DB_DRIVER=postgres
```

---

# Usage

## Running Migrations

```bash
cd axon

# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Create new migration
make migrate-create NAME=add_notification_metadata

# Check current version
make migrate-version

# Force version (if dirty state)
make migrate-force VERSION=1

# Migrate to specific version
make migrate-goto VERSION=2
```

---

# Migration History

Migration state is tracked in:

```sql
SELECT * FROM schema_migrations;
```

Example:

```
 version | dirty
---------+-------
       3 | f
```

---

# Creating New Migrations

## 1️⃣ Create Files

```bash
cd axon
make migrate-create NAME=add_notification_metadata
```

Creates:

```
{version}_{name}.up.sql
{version}_{name}.down.sql
```

---

## 2️⃣ Example Migration

### `000004_add_notification_metadata.up.sql`

```sql
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_notifications_metadata 
ON notifications USING GIN (metadata);
```

### `000004_add_notification_metadata.down.sql`

```sql
DROP INDEX IF EXISTS idx_notifications_metadata;
ALTER TABLE notifications DROP COLUMN IF EXISTS metadata;
```

---

# Schema Overview (Axon)

### 1️⃣ notifications

Stores all notification records

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| user_id | BIGINT | Recipient user ID |
| type | VARCHAR(50) | welcome, password_reset, etc. |
| subject | VARCHAR(255) | Email subject |
| body | TEXT | Email body |
| recipient | VARCHAR(255) | Email address |
| status | VARCHAR(50) | pending, sent, failed, delivered |
| provider_ref | VARCHAR(255) | SendGrid message ID |
| sent_at | TIMESTAMP | When sent |
| delivered_at | TIMESTAMP | When delivered |
| included_in_digest | BOOLEAN | Part of weekly digest |
| created_at | TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | Last update |

### 2️⃣ templates

Email templates for different notification types

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| name | VARCHAR(100) | Template name |
| type | VARCHAR(50) | welcome, password_reset, etc. |
| subject | VARCHAR(255) | Subject with {{.Variable}} |
| body_html | TEXT | HTML body |
| body_text | TEXT | Plain text body |
| sendgrid_id | VARCHAR(255) | SendGrid dynamic template ID |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | Last update |

### 3️⃣ user_preferences

User notification preferences

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| user_id | BIGINT | User ID (unique) |
| email_enabled | BOOLEAN | Email notifications on/off |
| digest_enabled | BOOLEAN | Weekly digest on/off |
| digest_weekly | BOOLEAN | Weekly digest preference |
| comment_replies | BOOLEAN | Comment reply notifications |
| post_updates | BOOLEAN | Post update notifications |
| created_at | TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | Last update |

---

# Default Templates

The migration includes seed data for default templates:

| Type | Name | Purpose |
|------|------|---------|
| welcome | Welcome Email | New user registration |
| password_reset | Password Reset | Password recovery |
| email_verify | Email Verification | Email confirmation |
| comment_reply | Comment Reply | Reply notifications |
| digest | Weekly Digest | Weekly summary |

---

# Rollback Strategy

## Development

```bash
make migrate-down
make migrate-goto VERSION=1
```

## Production Checklist

1. Test rollback in staging
2. Backup database
3. Use specific version targeting
4. Monitor application logs
5. Verify data integrity

---

# Troubleshooting

## Database in Dirty State

Error:

```
database is in dirty state at version 2
```

Solution:

```bash
make migrate-force VERSION=2
make migrate-up
```

---

## Migration Fails

1. Check SQL error
2. Test manually in psql
3. Fix migration
4. Rollback and retry

```bash
make migrate-down
make migrate-up
```

---

# Best Practices

### 1️⃣ Always Write Down Migrations

Every `.up.sql` must have a `.down.sql`.

---

### 2️⃣ Make Migrations Idempotent

```sql
CREATE TABLE IF NOT EXISTS notifications (...);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
```

---

### 3️⃣ Use Transactions for Data Migrations

```sql
BEGIN;

UPDATE notifications 
SET status = 'sent' 
WHERE status = 'pending' AND sent_at IS NOT NULL;

COMMIT;
```

---

### 4️⃣ Add Indexes Concurrently in Production

```sql
CREATE INDEX CONCURRENTLY idx_notifications_status 
ON notifications(status);
```

---

# CI/CD Integration

```yaml
- name: Run Axon migrations
  run: |
    cd axon
    make migrate-up
  env:
    DATABASE_URL: ${{ secrets.AXON_DATABASE_URL }}
```