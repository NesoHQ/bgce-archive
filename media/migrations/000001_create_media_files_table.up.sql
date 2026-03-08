-- Create media_files table
CREATE TABLE IF NOT EXISTS media_files (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    tenant_id INTEGER,
    user_id INTEGER,
    filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_files_user_id ON media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_tenant_id ON media_files(tenant_id);
CREATE INDEX IF NOT EXISTS idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at DESC);

-- Add comments
COMMENT ON TABLE media_files IS 'Stores metadata for uploaded media files';
COMMENT ON COLUMN media_files.uuid IS 'Unique identifier for the media file';
COMMENT ON COLUMN media_files.tenant_id IS 'Reference to tenant (multi-tenancy support)';
COMMENT ON COLUMN media_files.user_id IS 'Reference to user who uploaded the file';
COMMENT ON COLUMN media_files.filename IS 'Original filename';
COMMENT ON COLUMN media_files.file_path IS 'Storage path in MinIO/S3';
COMMENT ON COLUMN media_files.file_url IS 'Public URL to access the file';
COMMENT ON COLUMN media_files.mime_type IS 'MIME type of the file';
COMMENT ON COLUMN media_files.file_size IS 'File size in bytes';
COMMENT ON COLUMN media_files.width IS 'Image width in pixels (null for non-images)';
COMMENT ON COLUMN media_files.height IS 'Image height in pixels (null for non-images)';
