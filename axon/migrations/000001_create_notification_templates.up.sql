-- Create notification_templates table for email templates

CREATE TABLE IF NOT EXISTS notification_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(500) NOT NULL,
    body_html TEXT,
    body_text TEXT,
    sendgrid_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on type for fast lookups
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON notification_templates(type);

-- Insert default templates
INSERT INTO notification_templates (name, type, subject, body_html, body_text) VALUES
('Welcome Email', 'welcome', 'Welcome to BGCE Archive!', 
 '<h1>Welcome, {{.UserName}}!</h1><p>Start your learning journey today. <a href="https://bgcearchive.com/login">Login now</a></p>',
 'Welcome, {{.UserName}}! Start your learning journey today. Login at: https://bgcearchive.com/login'),
('Password Reset', 'password_reset', 'Reset Your Password',
 '<p>Click <a href="https://bgcearchive.com/reset-password?token={{.Token}}">here</a> to reset your password. Link expires in 1 hour.</p>',
 'Reset your password: https://bgcearchive.com/reset-password?token={{.Token}} (expires in 1 hour)'),
('Email Verification', 'email_verify', 'Verify Your Email Address',
 '<p>Click <a href="https://bgcearchive.com/verify-email?token={{.Token}}">here</a> to verify your email address.</p>',
 'Verify your email: https://bgcearchive.com/verify-email?token={{.Token}}'),
('Comment Reply', 'comment_reply', 'New Reply to Your Post',
 '<p>{{.CommenterName}} replied to your post "{{.PostTitle}}". <a href="https://bgcearchive.com/posts/{{.PostSlug}}">View comment</a></p>',
 '{{.CommenterName}} replied to your post "{{.PostTitle}}". View: https://bgcearchive.com/posts/{{.PostSlug}}'),
('Post Published', 'post_published', 'New Post from {{.AuthorName}}',
 '<p>{{.AuthorName}} published "{{.PostTitle}}". <a href="https://bgcearchive.com/posts/{{.PostSlug}}">Read now</a></p>',
 '{{.AuthorName}} published "{{.PostTitle}}". Read: https://bgcearchive.com/posts/{{.PostSlug}}'),
('Course Enrolled', 'course_enrolled', 'Enrollment Confirmed: {{.CourseName}}',
 '<p>You have successfully enrolled in "{{.CourseName}}". <a href="https://bgcearchive.com/courses/{{.CourseName}}">Start learning</a></p>',
 'You enrolled in "{{.CourseName}}". Start: https://bgcearchive.com/courses/{{.CourseName}}'),
('Weekly Digest', 'digest', 'Your Weekly Digest',
 '<h1>Your Weekly Activity</h1><p>{{.DigestContent}}</p>',
 'Your Weekly Activity: {{.DigestContent}}')
ON CONFLICT (type) DO NOTHING;