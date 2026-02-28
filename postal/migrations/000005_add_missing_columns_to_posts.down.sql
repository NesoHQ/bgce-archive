-- Rollback: Remove added columns from posts table

-- Drop indexes
DROP INDEX IF EXISTS idx_posts_tenant_id;

-- Remove columns
ALTER TABLE posts DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE posts DROP COLUMN IF EXISTS like_count;
ALTER TABLE posts DROP COLUMN IF EXISTS quality_score;
ALTER TABLE posts DROP COLUMN IF EXISTS readability_score;
