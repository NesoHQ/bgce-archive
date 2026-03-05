-- Migration: Add composite indexes to posts table for better query performance

-- Composite index for filtering by status and category
CREATE INDEX IF NOT EXISTS idx_posts_status_category ON posts(status, category_id) WHERE deleted_at IS NULL;

-- Composite index for filtering by status and subcategory
CREATE INDEX IF NOT EXISTS idx_posts_status_subcategory ON posts(status, sub_category_id) WHERE deleted_at IS NULL;

-- Composite index for featured posts
CREATE INDEX IF NOT EXISTS idx_posts_status_featured ON posts(status, is_featured) WHERE deleted_at IS NULL;

-- Composite index for pinned posts
CREATE INDEX IF NOT EXISTS idx_posts_status_pinned ON posts(status, is_pinned) WHERE deleted_at IS NULL;

-- Index for sorting by created_at (common sort field)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC) WHERE deleted_at IS NULL;

-- Index for sorting by view_count (popular posts)
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC) WHERE deleted_at IS NULL;
