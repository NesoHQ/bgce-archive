-- Drop trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop indexes
DROP INDEX IF EXISTS idx_users_tenant_id;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Drop table
DROP TABLE IF EXISTS users;
