-- Remove category indexes
DROP INDEX IF EXISTS idx_categories_parent_id;
DROP INDEX IF EXISTS idx_categories_status;
DROP INDEX IF EXISTS idx_categories_status_parent;
DROP INDEX IF EXISTS idx_categories_uuid;
DROP INDEX IF EXISTS idx_categories_created_at;
