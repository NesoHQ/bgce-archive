ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS reply_count INT NOT NULL DEFAULT 0;

-- Enforce valid status values at the DB layer.
-- IF NOT EXISTS guard: safe to run in dirty-state recovery scenarios.
ALTER TABLE comments
  ADD CONSTRAINT IF NOT EXISTS chk_comments_status
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam'));