-- Create email_preferences table for user notification preferences

CREATE TABLE email_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    digest_enabled BOOLEAN NOT NULL DEFAULT true,
    digest_weekly BOOLEAN NOT NULL DEFAULT true,
    comment_replies BOOLEAN NOT NULL DEFAULT true,
    post_updates BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_email_preferences_user_id ON email_preferences(user_id);

-- Add foreign key to users table (in cortex service)
ALTER TABLE email_preferences
    ADD CONSTRAINT fk_email_preferences_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
