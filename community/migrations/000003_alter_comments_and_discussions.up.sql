-- Migration: Schema changes for comments and discussions (reference keys only; no FK constraints — microservice architecture)
-- ===================================
-- ALTER comments TABLE
-- ===================================
ALTER TABLE comments
  DROP COLUMN IF EXISTS deleted_at;

-- ===================================
-- ALTER discussions TABLE
-- ===================================
ALTER TABLE discussions
  DROP COLUMN IF EXISTS deleted_at,
  DROP COLUMN IF EXISTS is_pinned,
  DROP COLUMN IF EXISTS reply_count,
  DROP COLUMN IF EXISTS last_activity_at;

-- Drop old index if exists
DROP INDEX IF EXISTS idx_discussions_deleted_at;
