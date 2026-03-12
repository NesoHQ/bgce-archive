-- Revert comment_reply template to remove comment field
UPDATE templates SET
    body_html = '<h1>New Comment Reply</h1><p><strong>{{.CommenterName}}</strong> replied to your post "{{.PostTitle}}"</p>',
    body_text = 'New Comment Reply\n\n{{.CommenterName}} replied to your post "{{.PostTitle}}"',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'comment_reply';
