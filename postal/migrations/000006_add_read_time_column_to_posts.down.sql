-- Rollback: Remove read_time column from posts table

-- Drop index first if it was created
DROP INDEX IF EXISTS idx_posts_read_time;

ALTER TABLE posts
DROP COLUMN IF EXISTS read_time;