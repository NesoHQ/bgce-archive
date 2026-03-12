-- Update comment_reply template to include comment field
UPDATE templates SET
    body_html = '<h1>New Comment Reply</h1><p><strong>{{.CommenterName}}</strong> replied to your post "{{.PostTitle}}":</p><blockquote>{{.Comment}}</blockquote>',
    body_text = 'New Comment Reply\n\n{{.CommenterName}} replied to your post "{{.PostTitle}}":\n\n{{.Comment}}',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'comment_reply';
