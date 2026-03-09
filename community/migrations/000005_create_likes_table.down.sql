-- Rollback: Drop likes table
DROP TRIGGER IF EXISTS update_likes_updated_at ON likes;
DROP INDEX IF EXISTS idx_likes_likeable;
DROP INDEX IF EXISTS idx_likes_user_id;
DROP TABLE IF EXISTS likes;
