# Database Migrations

This directory contains database migrations for the Cortex service using [golang-migrate](https://github.com/golang-migrate/migrate).

## Overview

Migrations are versioned SQL files that allow you to evolve your database schema over time in a controlled and reproducible way.

## Migration Files

Each migration consists of two files:
- `{version}_{name}.up.sql` - Applied when migrating forward
- `{version}_{name}.down.sql` - Applied when rolling back

Example:
```
000001_create_tenants_table.up.sql
000001_create_tenants_table.down.sql
```

## Commands

### Install golang-migrate CLI

```bash
make migrate-install
```

### Create a new migration

```bash
make migrate-create NAME=add_user_avatar
```

This creates two files:
- `migrations/000004_add_user_avatar.up.sql`
- `migrations/000004_add_user_avatar.down.sql`

### Apply all pending migrations

```bash
make migrate-up
```

Or with custom database URL:
```bash
DATABASE_URL="postgresql://user:pass@host:port/dbname?sslmode=disable" make migrate-up
```

### Rollback last migration

```bash
make migrate-down
```

### Check current migration version

```bash
make migrate-version
```

### Migrate to specific version

```bash
make migrate-goto VERSION=2
```

### Force migration version (use with caution)

If your database is in a dirty state, you can force it to a specific version:

```bash
make migrate-force VERSION=1
```

## Migration Best Practices

### 1. Always write down migrations

Every `.up.sql` must have a corresponding `.down.sql` for rollback capability.

### 2. Make migrations idempotent

Use `IF NOT EXISTS` and `IF EXISTS` clauses:

```sql
-- Good
CREATE TABLE IF NOT EXISTS users (...);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Bad
CREATE TABLE users (...);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Never modify existing migrations

Once a migration is merged to main, never edit it. Create a new migration instead.

```bash
# Wrong: Editing 000001_create_users.up.sql

# Right: Creating new migration
make migrate-create NAME=add_user_avatar_column
```

### 4. Test migrations locally

```bash
# Apply migration
make migrate-up

# Test rollback
make migrate-down

# Re-apply
make migrate-up
```

### 5. Use transactions for data migrations

```sql
-- 000005_migrate_user_data.up.sql
BEGIN;

UPDATE users SET skill_level = 'beginner' WHERE skill_level IS NULL;

COMMIT;
```

### 6. Add indexes concurrently in production

For large tables, use `CONCURRENTLY` to avoid locking:

```sql
CREATE INDEX CONCURRENTLY idx_posts_category_id ON posts(category_id);
```

### 7. Handle schema vs data migrations separately

```
000001_create_users_table.up.sql       -- Schema
000002_seed_default_users.up.sql       -- Data
000003_add_user_avatar_column.up.sql   -- Schema
000004_migrate_user_avatars.up.sql     -- Data
```

## Automatic Migrations

Migrations are automatically run when the service starts. The migration runner:
- Checks the current database version
- Applies all pending migrations in order
- Logs the migration progress
- Fails fast if a migration fails

## Troubleshooting

### Database is in dirty state

If a migration fails halfway through, the database will be marked as "dirty":

```
Error: database is in dirty state at version 3
```

To fix:
1. Manually fix the database issue
2. Force the version:
   ```bash
   make migrate-force VERSION=3
   ```
3. Try migrating again:
   ```bash
   make migrate-up
   ```

### Migration fails

1. Check the error message
2. Review the SQL in the migration file
3. Test the SQL manually in psql
4. Fix the migration file
5. Rollback and try again:
   ```bash
   make migrate-down
   make migrate-up
   ```

## Current Migrations

- `000001` - Create tenants table (with AI quota tracking)
- `000002` - Create users table (with tenant_id, skill_level, learning_goals, ai_preferences)
- `000003` - Create categories table (with tenant_id, parent_id, icon, color, embedding support)

## Schema Notes

### Vector Embeddings

The schema includes support for pgvector embeddings (vector(1536)) for AI-powered features:
- Categories have embeddings for semantic search
- Posts will have content embeddings (in postal service)
- Tags will have embeddings (in postal service)

To enable vector indexes, you need to:
1. Install pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`
2. Create IVFFLAT indexes after data is populated

### Multi-tenancy

All tables include `tenant_id` for multi-tenant support, allowing the platform to serve multiple organizations.

### Foreign Keys

Foreign keys use `DEFERRABLE INITIALLY IMMEDIATE` to allow flexibility in transaction ordering while maintaining referential integrity.

## References

- [golang-migrate documentation](https://github.com/golang-migrate/migrate)
- [Database Migration Strategy](../architecture/05_Database_Migration_Strategy.md)
