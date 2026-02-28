-- Migration: Add AI quota fields to tenants table
-- This migration adds new columns to existing tenants table for AI feature tracking

-- Add new columns if they don't exist
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS ai_quota_monthly INT DEFAULT 1000;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS ai_usage_current INT DEFAULT 0;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tenants if not exists
DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at 
    BEFORE UPDATE ON tenants
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have default AI quota values
UPDATE tenants 
SET ai_quota_monthly = 1000, ai_usage_current = 0 
WHERE ai_quota_monthly IS NULL OR ai_usage_current IS NULL;
