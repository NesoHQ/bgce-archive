-- Revert comment_reply template changes
UPDATE templates SET
    body_html = '<h1>New Comment Reply</h1><p>Hi {{.PostAuthorName}},</p><p><strong>{{.CommenterName}}</strong> replied to your post "{{.PostTitle}}":</p><blockquote>{{.Comment}}</blockquote>',
    body_text = 'New Comment Reply\n\nHi {{.PostAuthorName}},\n\n{{.CommenterName}} replied to your post "{{.PostTitle}}":\n\n{{.Comment}}',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'comment_reply';
