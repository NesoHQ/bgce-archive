-- Add missing indexes for category queries optimization
-- These indexes will significantly improve query performance

-- Index on parent_id for filtering top-level categories (WHERE parent_id IS NULL)
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Index on status for filtering approved categories
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);

-- Composite index for common query pattern (status + parent_id)
CREATE INDEX IF NOT EXISTS idx_categories_status_parent ON categories(status, parent_id);

-- Index on uuid for subcategory lookups
CREATE INDEX IF NOT EXISTS idx_categories_uuid ON categories(uuid);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at);
