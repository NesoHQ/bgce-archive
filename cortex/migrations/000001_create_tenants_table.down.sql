-- Rollback: Remove AI quota fields from tenants table

-- Remove columns added in this migration
ALTER TABLE tenants DROP COLUMN IF EXISTS ai_usage_current;
ALTER TABLE tenants DROP COLUMN IF EXISTS ai_quota_monthly;

-- Note: We don't drop indexes or triggers as they may have existed before this migration
