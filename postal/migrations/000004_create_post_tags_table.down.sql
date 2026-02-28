-- Rollback: Drop post_tags table

-- Drop indexes
DROP INDEX IF EXISTS idx_post_tags_tag_id;
DROP INDEX IF EXISTS idx_post_tags_post_id;
DROP INDEX IF EXISTS idx_post_tags_post_id_tag_id;

-- Drop table
DROP TABLE IF EXISTS post_tags;
