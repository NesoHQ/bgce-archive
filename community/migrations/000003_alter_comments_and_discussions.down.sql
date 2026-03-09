-- Rollback: Restore dropped columns and index (no FK constraints to drop — reference keys only)

ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE discussions
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reply_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP;

-- Restore old index
CREATE INDEX IF NOT EXISTS idx_discussions_deleted_at ON discussions(deleted_at);
