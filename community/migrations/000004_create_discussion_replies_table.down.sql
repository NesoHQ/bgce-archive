-- Rollback: Drop discussion_replies table
DROP TRIGGER IF EXISTS update_discussion_replies_updated_at ON discussion_replies;

DROP INDEX IF EXISTS idx_discussion_replies_is_solution;
DROP INDEX IF EXISTS idx_discussion_replies_parent_id;
DROP INDEX IF EXISTS idx_discussion_replies_user_id;
DROP INDEX IF EXISTS idx_discussion_replies_discussion_id;

DROP TABLE IF EXISTS discussion_replies;