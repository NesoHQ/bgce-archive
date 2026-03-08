-- Drop indexes
DROP INDEX IF EXISTS idx_media_files_created_at;
DROP INDEX IF EXISTS idx_media_files_mime_type;
DROP INDEX IF EXISTS idx_media_files_tenant_id;
DROP INDEX IF EXISTS idx_media_files_user_id;

-- Drop table
DROP TABLE IF EXISTS media_files;
