-- Rollback: Drop tags table

-- Drop indexes
DROP INDEX IF EXISTS idx_tags_tenant_id;
DROP INDEX IF EXISTS idx_tags_slug;

-- Drop table
DROP TABLE IF EXISTS tags;
