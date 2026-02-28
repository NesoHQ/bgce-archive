-- Migration: Ensure post_versions table structure
-- This migration ensures the post_versions table has the correct structure

-- The table should already exist from GORM AutoMigrate, so we just ensure indexes exist

-- Create unique index on post_id and version_no combination if not exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_versions_post_id_version_no ON post_versions(post_id, version_no);

-- Ensure basic index exists
CREATE INDEX IF NOT EXISTS idx_post_versions_post_id ON post_versions(post_id);

-- Add comment
COMMENT ON TABLE post_versions IS 'Stores historical versions of posts for audit and rollback purposes';
