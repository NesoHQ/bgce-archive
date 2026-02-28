-- Migration: Add missing columns to posts table
-- This migration adds columns that exist in GORM model but were missing from the initial migration

-- Add tenant_id for multi-tenant support
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tenant_id INT;

-- Add like_count for engagement tracking
ALTER TABLE posts ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0;

-- Add AI-powered quality metrics
ALTER TABLE posts ADD COLUMN IF NOT EXISTS quality_score DECIMAL(3,2);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS readability_score DECIMAL(3,2);

-- Create index for tenant_id
CREATE INDEX IF NOT EXISTS idx_posts_tenant_id ON posts(tenant_id);

-- Update existing records to have default like_count
UPDATE posts 
SET like_count = 0 
WHERE like_count IS NULL;
