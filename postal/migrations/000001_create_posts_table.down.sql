-- Rollback: Remove AI features and quality metrics from posts table

-- Remove columns added in this migration
ALTER TABLE posts DROP COLUMN IF EXISTS like_count;
ALTER TABLE posts DROP COLUMN IF EXISTS readability_score;
ALTER TABLE posts DROP COLUMN IF EXISTS quality_score;
ALTER TABLE posts DROP COLUMN IF EXISTS tenant_id;
-- ALTER TABLE posts DROP COLUMN IF EXISTS content_embedding;  -- Uncomment if vector column was added

-- Rename column back if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'thumbnail_url'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'thumbnail'
    ) THEN
        ALTER TABLE posts RENAME COLUMN thumbnail_url TO thumbnail;
    END IF;
END $$;

-- Remove index
DROP INDEX IF EXISTS idx_posts_tenant_id;
