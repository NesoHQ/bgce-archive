-- Rollback: Remove user profile and learning fields from users table

-- Remove foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_tenant;

-- Remove columns added in this migration
ALTER TABLE users DROP COLUMN IF EXISTS ai_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS learning_goals;
ALTER TABLE users DROP COLUMN IF EXISTS skill_level;
ALTER TABLE users DROP COLUMN IF EXISTS bio;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE users DROP COLUMN IF EXISTS tenant_id;

-- Remove index
DROP INDEX IF EXISTS idx_users_tenant_id;
