-- Create user_notification_preferences table

CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    digest_enabled BOOLEAN DEFAULT true,
    digest_weekly BOOLEAN DEFAULT true,
    comment_replies BOOLEAN DEFAULT true,
    post_updates BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);