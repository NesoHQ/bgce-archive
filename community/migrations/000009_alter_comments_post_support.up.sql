ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS reply_count INT NOT NULL DEFAULT 0;

ALTER TABLE comments
  ADD CONSTRAINT chk_comments_status
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam'));