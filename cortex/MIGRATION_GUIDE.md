# Database Migration Implementation Guide (Cortex Service)

This document describes the implementation of database version control for the **Cortex Service** using:

* golang-migrate

---

## Overview

Cortex now uses **versioned SQL migrations** instead of Ent auto schema creation.

---

## What Changed

### Before (Ent Auto Migration)

```go
// Auto-migration on startup - NO VERSION CONTROL
if err := entClient.Schema.Create(ctx); err != nil {
    return err
}
```

### Problems

* ❌ No migration version control
* ❌ No rollback capability
* ❌ No migration history
* ❌ Unsafe for production schema evolution

---

### After (golang-migrate)

Cortex now uses:

* ✅ Versioned `.up.sql` / `.down.sql`
* ✅ Rollback capability
* ✅ Migration history tracking
* ✅ Dirty state recovery
* ✅ Production-safe schema evolution

---

# Directory Structure (Cortex Only)

```
cortex/
├── migrations/
│   ├── README.md
│   ├── 000001_create_tenants_table.up.sql
│   ├── 000001_create_tenants_table.down.sql
│   ├── 000002_create_users_table.up.sql
│   ├── 000002_create_users_table.down.sql
│   ├── 000003_create_categories_table.up.sql
│   └── 000003_create_categories_table.down.sql
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
BGCE_DB_DSN=postgresql://postgres:root@localhost:5433/cortex_db?sslmode=disable
```

---

# Usage

## Running Migrations

```bash
cd cortex

# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Create new migration
make migrate-create NAME=add_user_avatar

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
cd cortex
make migrate-create NAME=add_user_preferences
```

Creates:

```
{version}_{name}.up.sql
{version}_{name}.down.sql
```

---

## 2️⃣ Example Migration

### `000004_add_user_preferences.up.sql`

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_users_preferences 
ON users USING GIN (preferences);
```

### `000004_add_user_preferences.down.sql`

```sql
DROP INDEX IF EXISTS idx_users_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS preferences;
```

---

# Schema Overview (Cortex)

### 1️⃣ tenants

* ai_quota_monthly
* ai_usage_current

### 2️⃣ users

* tenant_id
* avatar_url
* bio
* skill_level
* learning_goals
* ai_preferences

### 3️⃣ categories

* tenant_id
* icon
* color
* embedding (vector support)

---

# Vector Embeddings Setup (pgvector)

Cortex supports AI embeddings for semantic search.

## 1️⃣ Install Extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## 2️⃣ Create Vector Index

```sql
CREATE INDEX idx_categories_embedding 
ON categories USING IVFFLAT (embedding);
```

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
CREATE TABLE IF NOT EXISTS tenants (...);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
```

---

### 3️⃣ Use Transactions for Data Migrations

```sql
BEGIN;

UPDATE users 
SET skill_level = 'beginner' 
WHERE skill_level IS NULL;

COMMIT;
```

---

### 4️⃣ Add Indexes Concurrently in Production

```sql
CREATE INDEX CONCURRENTLY idx_categories_tenant_id 
ON categories(tenant_id);
```

---

# CI/CD Integration

```yaml
- name: Run Cortex migrations
  run: |
    cd cortex
    make migrate-up
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

# Next Steps

1. ✅ Cortex migrations implemented
2. ⏳ Add foreign key constraints
3. ⏳ Add automated migration testing in CI/CD
4. ⏳ Create migration templates

---