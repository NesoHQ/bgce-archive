-- Migration: Add user profile and learning fields to users table
-- This migration adds new columns to existing users table for user profiles and learning features

-- Add new columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id INT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skill_level VARCHAR(20) DEFAULT 'beginner';
ALTER TABLE users ADD COLUMN IF NOT EXISTS learning_goals JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_preferences JSONB;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_tenant'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_tenant 
            FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);

-- Create trigger for users if not exists
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have default skill level
UPDATE users 
SET skill_level = 'beginner' 
WHERE skill_level IS NULL;
