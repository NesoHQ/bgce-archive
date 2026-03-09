-- Rollback: Drop follows table
DROP TRIGGER IF EXISTS update_follows_updated_at ON follows;
DROP INDEX IF EXISTS idx_follows_following_id;
DROP INDEX IF EXISTS idx_follows_follower_id;
DROP TABLE IF EXISTS follows;
