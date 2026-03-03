-- Rollback: Drop comments table
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TABLE IF EXISTS comments;
