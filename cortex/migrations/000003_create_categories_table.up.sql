-- Migration: Add tenant support and visual fields to categories table
-- This migration adds new columns to existing categories table for multi-tenancy and UI features

-- Add new columns if they don't exist
ALTER TABLE categories ADD COLUMN IF NOT EXISTS tenant_id INT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color VARCHAR(50);

-- Note: Vector embedding column requires pgvector extension
-- Uncomment the following lines after installing pgvector extension:
-- CREATE EXTENSION IF NOT EXISTS vector;
-- ALTER TABLE categories ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_categories_tenant'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT fk_categories_tenant 
            FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_categories_parent'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT fk_categories_parent 
            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_categories_created_by'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT fk_categories_created_by 
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON categories(tenant_id);

-- Note: Vector index will be created separately after pgvector extension is enabled
-- CREATE INDEX IF NOT EXISTS idx_categories_embedding ON categories USING IVFFLAT (embedding);
