-- Drop trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- Drop indexes
DROP INDEX IF EXISTS idx_posts_status;
DROP INDEX IF EXISTS idx_posts_tenant_id;
DROP INDEX IF EXISTS idx_posts_category_id;
DROP INDEX IF EXISTS idx_posts_slug;

-- Drop table
DROP TABLE IF EXISTS posts;

-- Note: We don't drop the update_updated_at_column function as it might be used by other tables
