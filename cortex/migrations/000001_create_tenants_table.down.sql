-- Drop trigger
DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;

-- Drop indexes
DROP INDEX IF EXISTS idx_tenants_status;
DROP INDEX IF EXISTS idx_tenants_domain;
DROP INDEX IF EXISTS idx_tenants_slug;

-- Drop table
DROP TABLE IF EXISTS tenants;

-- Note: We don't drop the update_updated_at_column function as it might be used by other tables
