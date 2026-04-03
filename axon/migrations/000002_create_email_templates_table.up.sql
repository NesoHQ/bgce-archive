-- Create email_templates table for storing email templates

CREATE TABLE email_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT,
    body_text TEXT,
    sendgrid_id VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_email_templates_type ON email_templates(type);
CREATE INDEX idx_email_templates_is_active ON email_templates(is_active);

-- Add check constraint for type
ALTER TABLE email_templates
    ADD CONSTRAINT chk_email_templates_type
    CHECK (type IN ('welcome', 'password_reset', 'email_verify', 'comment_reply', 'post_published', 'course_enrolled', 'digest'));

-- Insert default templates
INSERT INTO email_templates (name, type, subject, body_html, body_text, is_active) VALUES
('Welcome Email', 'welcome', 'Welcome to BGCE Archive!', 
 '<h1>Welcome!</h1><p>Thank you for joining BGCE Archive.</p>',
 'Welcome! Thank you for joining BGCE Archive.', true),

('Password Reset', 'password_reset', 'Reset Your Password',
 '<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p>{{.ResetLink}}</p>',
 'Password Reset. Click the link below to reset your password: {{.ResetLink}}', true),

('Email Verification', 'email_verify', 'Verify Your Email',
 '<h1>Verify Your Email</h1><p>Click the link below to verify your email:</p><p>{{.VerifyLink}}</p>',
 'Verify Your Email. Click the link below: {{.VerifyLink}}', true),

('Comment Reply', 'comment_reply', 'New Reply to Your Comment',
 '<h1>New Reply</h1><p>{{.Author}} replied to your comment:</p><p>{{.Content}}</p>',
 'New Reply. {{.Author}} replied to your comment: {{.Content}}', true),

('Post Published', 'post_published', 'New Post from {{.Author}}',
 '<h1>New Post</h1><p>{{.Author}} published a new post:</p><p>{{.Title}}</p>',
 'New Post. {{.Author}} published: {{.Title}}', true),

('Course Enrollment', 'course_enrolled', 'Enrollment Confirmed',
 '<h1>Enrollment Confirmed</h1><p>You have been enrolled in {{.CourseName}}</p>',
 'Enrollment Confirmed. You have been enrolled in {{.CourseName}}', true),

('Weekly Digest', 'digest', 'Your Weekly Digest',
 '<h1>Weekly Digest</h1><p>Here is your weekly summary:</p>{{.Content}}',
 'Weekly Digest. Here is your weekly summary: {{.Content}}', true);
