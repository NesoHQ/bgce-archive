-- Seed default email templates
INSERT INTO templates (name, type, subject, body_html, body_text, is_active, created_at, updated_at) VALUES
(
    'Welcome Email',
    'welcome',
    'Welcome to BGCE Archive, {{.Name}}!',
    '<h1>Welcome to BGCE Archive!</h1><p>Hi {{.Name}},</p><p>Thank you for joining us. We are excited to have you on board!</p><p>Best regards,<br>BGCE Archive Team</p>',
    'Welcome to BGCE Archive!\n\nHi {{.Name}},\n\nThank you for joining us. We are excited to have you on board!\n\nBest regards,\nBGCE Archive Team',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Password Reset',
    'password_reset',
    'Password Reset Request',
    '<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href="{{.ResetURL}}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>',
    'Password Reset\n\nClick the link below to reset your password:\n{{.ResetURL}}\n\nIf you did not request this, please ignore this email.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Email Verification',
    'email_verify',
    'Verify Your Email Address',
    '<h1>Email Verification</h1><p>Click the link below to verify your email:</p><p><a href="{{.VerifyURL}}">Verify Email</a></p>',
    'Email Verification\n\nClick the link below to verify your email:\n{{.VerifyURL}}',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Comment Reply',
    'comment_reply',
    'New reply to your post: {{.PostTitle}}',
    '<h1>New Comment Reply</h1><p>Hi {{.PostAuthorName}},</p><p><strong>{{.CommenterName}}</strong> replied to your post "{{.PostTitle}}":</p><blockquote>{{.Comment}}</blockquote>',
    'New Comment Reply\n\nHi {{.PostAuthorName}},\n\n{{.CommenterName}} replied to your post "{{.PostTitle}}":\n\n{{.Comment}}',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Post Published',
    'post_published',
    '{{.AuthorName}} published a new post: {{.PostTitle}}',
    '<h1>New Post Published</h1><p>Hi,</p><p>{{.AuthorName}} just published a new post: <strong>{{.PostTitle}}</strong></p><p><a href="{{.PostURL}}">Read the post</a></p>',
    'New Post Published\n\nHi,\n\n{{.AuthorName}} just published a new post: {{.PostTitle}}\n\nRead the post: {{.PostURL}}',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Course Enrolled',
    'course_enrolled',
    'You have enrolled in {{.CourseName}}',
    '<h1>Course Enrollment Confirmed</h1><p>Congratulations! You have successfully enrolled in <strong>{{.CourseName}}</strong>.</p><p>You can start learning right away.</p>',
    'Course Enrollment Confirmed\n\nCongratulations! You have successfully enrolled in {{.CourseName}}.\n\nYou can start learning right away.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
