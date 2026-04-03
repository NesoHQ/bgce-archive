# Database Migration Implementation Guide (Axon Service)

This document describes the implementation of database version control for the **Axon Notification Service** using:

* golang-migrate

---

## Overview

Axon uses **versioned SQL migrations** instead of GORM AutoMigrate.

### What Changed

### Before (GORM AutoMigrate)

```go
// Auto-migration - NO VERSION CONTROL
err := db.AutoMigrate(&domain.Notification{}, &domain.Template{}, &domain.UserPreference{})
```

Problems:

* ❌ No version tracking
* ❌ No rollback support
* ❌ Unsafe in production
* ❌ No migration history

---

### After (golang-migrate)

Axon now uses:

* ✅ Versioned `.up.sql` / `.down.sql`
* ✅ Rollback capability
* ✅ Migration history tracking
* ✅ Dirty state recovery
* ✅ Production-safe approach

---

# Directory Structure (Axon Only)

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
│   └── migrate.go
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

Example output:

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

* user_id (recipient)
* type (welcome, password_reset, etc.)
* status (pending, sent, failed, delivered)
* provider_ref (email provider message ID)

### 2️⃣ templates

* Email templates by type
* Subject with {{.Variable}} support
* HTML and text body variants

### 3️⃣ user_preferences

* Per-user notification settings
* Email/digest toggles
* Comment reply and post update preferences

---

# Default Templates

Migration includes seed data for default templates:

| Type           | Name               | Purpose               |
| -------------- | ------------------ | --------------------- |
| welcome        | Welcome Email      | New user registration |
| password_reset | Password Reset     | Password recovery     |
| email_verify   | Email Verification | Email confirmation    |
| comment_reply  | Comment Reply      | Reply notifications   |
| digest         | Weekly Digest      | Weekly summary        |

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
4. Monitor logs
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
-- Good
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

---

# Next Steps

1. ✅ Axon migrations implemented
2. ⏳ Add foreign key constraints to Cortex users table
3. ⏳ Add automated migration testing in CI/CD
4. ⏳ Create migration templates for new notification types

---
