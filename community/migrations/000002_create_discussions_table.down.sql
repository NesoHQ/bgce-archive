-- Rollback: Drop discussions table
DROP TRIGGER IF EXISTS update_discussions_updated_at ON discussions;
DROP TABLE IF EXISTS discussions;
