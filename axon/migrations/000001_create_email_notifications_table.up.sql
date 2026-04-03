-- Create email_notifications table for tracking email notifications
-- This is separate from the in-app notifications table

CREATE TABLE email_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    provider_ref VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_type ON email_notifications(type);
CREATE INDEX idx_email_notifications_created_at ON email_notifications(created_at);

-- Add foreign key to users table (in cortex service)
-- Note: This assumes users table exists in the same database
ALTER TABLE email_notifications
    ADD CONSTRAINT fk_email_notifications_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add check constraint for status
ALTER TABLE email_notifications
    ADD CONSTRAINT chk_email_notifications_status
    CHECK (status IN ('pending', 'sent', 'failed', 'delivered'));

-- Add check constraint for type
ALTER TABLE email_notifications
    ADD CONSTRAINT chk_email_notifications_type
    CHECK (type IN ('welcome', 'password_reset', 'email_verify', 'comment_reply', 'post_published', 'course_enrolled', 'digest'));
