-- Rollback: Drop notifications table
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
DROP INDEX IF EXISTS idx_notifications_user_read;
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP TABLE IF EXISTS notifications;
