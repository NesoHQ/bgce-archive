-- Rollback: Remove tenant support and visual fields from categories table

-- Remove foreign key constraints
ALTER TABLE categories DROP CONSTRAINT IF EXISTS fk_categories_created_by;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS fk_categories_parent;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS fk_categories_tenant;

-- Remove columns added in this migration
ALTER TABLE categories DROP COLUMN IF EXISTS color;
ALTER TABLE categories DROP COLUMN IF EXISTS icon;
ALTER TABLE categories DROP COLUMN IF EXISTS tenant_id;
-- ALTER TABLE categories DROP COLUMN IF EXISTS embedding;  -- Uncomment if vector column was added

-- Remove index
DROP INDEX IF EXISTS idx_categories_tenant_id;
