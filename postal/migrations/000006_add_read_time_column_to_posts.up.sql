-- Migration: Add read_time column to posts table

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS read_time INT NULL DEFAULT 1;

-- Optional index
-- CREATE INDEX IF NOT EXISTS idx_posts_read_time ON posts(read_time);