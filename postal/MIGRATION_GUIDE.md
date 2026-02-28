# Database Migration Implementation Guide (Postal Service)

This document describes the implementation of database version control for the **Postal Service** using:

* golang-migrate

---

## Overview

Postal now uses **versioned SQL migrations** instead of GORM AutoMigrate.

### What Changed

### Before (GORM AutoMigrate)

```go
// Auto-migration - NO VERSION CONTROL
err := db.AutoMigrate(&domain.Post{}, &domain.PostVersion{})
```

Problems:

* ❌ No version tracking
* ❌ No rollback support
* ❌ Unsafe in production
* ❌ No migration history

---

### After (golang-migrate)

Postal now uses:

* ✅ Versioned `.up.sql` / `.down.sql`
* ✅ Rollback capability
* ✅ Migration history tracking
* ✅ Dirty state recovery
* ✅ Production-safe approach

---

# Directory Structure (Postal Only)

```
postal/
├── migrations/
│   ├── README.md
│   ├── 000001_create_posts_table.up.sql
│   ├── 000001_create_posts_table.down.sql
│   ├── 000002_create_post_versions_table.up.sql
│   ├── 000002_create_post_versions_table.down.sql
│   ├── 000003_create_tags_table.up.sql
│   ├── 000003_create_tags_table.down.sql
│   ├── 000004_create_post_tags_table.up.sql
│   └── 000004_create_post_tags_table.down.sql
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
POSTAL_DB_DSN=postgresql://postgres:root@localhost:5432/postal_db?sslmode=disable
```

---

# Usage

## Running Migrations

```bash
cd postal

# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Create new migration
make migrate-create NAME=add_post_reactions

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
       4 | f
```

---

# Creating New Migrations

## 1️⃣ Create Files

```bash
cd postal
make migrate-create NAME=add_user_preferences
```

Creates:

```
{version}_{name}.up.sql
{version}_{name}.down.sql
```

---

## 2️⃣ Example Migration

### `000005_add_user_preferences.up.sql`

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_users_preferences 
ON users USING GIN (preferences);
```

### `000005_add_user_preferences.down.sql`

```sql
DROP INDEX IF EXISTS idx_users_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS preferences;
```

---

# Schema Overview (Postal)

### 1️⃣ posts

* tenant_id
* content_embedding
* quality_score
* readability_score
* like_count

### 2️⃣ post_versions

* Version history tracking

### 3️⃣ tags (NEW)

* embedding (vector support)
* usage tracking

### 4️⃣ post_tags (NEW)

* Many-to-many relation

---

# Vector Embeddings Setup (pgvector)

Postal supports AI embeddings.

## 1️⃣ Install Extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## 2️⃣ Create Indexes

```sql
CREATE INDEX idx_posts_content_embedding 
ON posts USING IVFFLAT (content_embedding);

CREATE INDEX idx_tags_embedding 
ON tags USING IVFFLAT (embedding);
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
4. Monitor logs
5. Verify data integrity

---

# Troubleshooting

## Database in Dirty State

Error:

```
database is in dirty state at version 3
```

Solution:

```bash
make migrate-force VERSION=3
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
CREATE TABLE IF NOT EXISTS users (...);
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
CREATE INDEX CONCURRENTLY idx_posts_category_id 
ON posts(category_id);
```

---

# CI/CD Integration

```yaml
- name: Run Postal migrations
  run: |
    cd postal
    make migrate-up
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

# Next Steps

1. ✅ Postal migrations implemented
2. ⏳ Add foreign key constraints
3. ⏳ Add automated migration testing in CI/CD
4. ⏳ Create migration templates

---