-- Remove seeded templates
DELETE FROM templates WHERE type IN ('welcome', 'password_reset', 'email_verify', 'comment_reply', 'post_published', 'course_enrolled');
