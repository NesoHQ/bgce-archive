-- Migration: Add AI features and quality metrics to posts table
-- This migration adds new columns to existing posts table for AI-powered features

-- Add new columns if they don't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tenant_id INT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS quality_score DECIMAL(3,2);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS readability_score DECIMAL(3,2);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0;

-- Rename column if it exists with old name
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'thumbnail'
    ) THEN
        ALTER TABLE posts RENAME COLUMN thumbnail TO thumbnail_url;
    END IF;
END $$;

-- Add thumbnail_url if neither thumbnail nor thumbnail_url exists
ALTER TABLE posts ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500);

-- Note: Vector embedding column requires pgvector extension
-- Uncomment the following lines after installing pgvector extension:
-- CREATE EXTENSION IF NOT EXISTS vector;
-- ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_embedding vector(1536);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_tenant_id ON posts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- Note: Vector index will be created separately after pgvector extension is enabled
-- CREATE INDEX IF NOT EXISTS idx_posts_content_embedding ON posts USING IVFFLAT (content_embedding);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update existing records to have default like_count
UPDATE posts 
SET like_count = 0 
WHERE like_count IS NULL;
