-- Rollback: Remove indexes from post_versions table

-- Drop unique index
DROP INDEX IF EXISTS idx_post_versions_post_id_version_no;
DROP INDEX IF EXISTS idx_post_versions_post_id;
