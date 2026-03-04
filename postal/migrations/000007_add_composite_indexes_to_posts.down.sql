-- Migration: Remove composite indexes from posts table

DROP INDEX IF EXISTS idx_posts_status_category;
DROP INDEX IF EXISTS idx_posts_status_subcategory;
DROP INDEX IF EXISTS idx_posts_status_featured;
DROP INDEX IF EXISTS idx_posts_status_pinned;
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_view_count;
