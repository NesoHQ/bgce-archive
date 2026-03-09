-- Rollback: Drop notifications table
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;

DROP TABLE IF EXISTS notifications;
