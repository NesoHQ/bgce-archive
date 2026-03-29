-- Rollback: Drop contributors table
DROP INDEX IF EXISTS idx_contributors_updated_by;
DROP INDEX IF EXISTS idx_contributors_created_by;
DROP INDEX IF EXISTS idx_contributors_contribution_type;
DROP TABLE IF EXISTS contributors;
