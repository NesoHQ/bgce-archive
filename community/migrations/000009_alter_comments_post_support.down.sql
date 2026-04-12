-- Drop constraint before column — order matters, constraint references the column.
ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS chk_comments_status;

ALTER TABLE comments
  DROP COLUMN IF EXISTS reply_count;