-- Rollback: Drop likes table
DROP TRIGGER IF EXISTS update_likes_updated_at ON likes;
DROP INDEX IF EXISTS idx_likes_likeable;
DROP TABLE IF EXISTS likes;
