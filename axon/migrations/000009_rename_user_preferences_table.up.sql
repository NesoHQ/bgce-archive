-- Rename user_notification_preferences to user_preferences to match GORM expectations
ALTER TABLE user_notification_preferences RENAME TO user_preferences;
