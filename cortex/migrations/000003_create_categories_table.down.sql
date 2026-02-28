-- Drop trigger
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;

-- Drop indexes
DROP INDEX IF EXISTS idx_categories_tenant_id;
DROP INDEX IF EXISTS idx_categories_slug;

-- Drop table
DROP TABLE IF EXISTS categories;
