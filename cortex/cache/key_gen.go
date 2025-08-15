package cache

import (
	"fmt"

	"github.com/google/uuid"
)

const (
	prefixCategory = "category"
	prefixConfig   = "config"
	prefixTopPosts = "topposts"
	prefixSlugs    = "slugs"
)

func (*cache) SlugsKey() string {
	return fmt.Sprintf("%s:%s", prefixCategory, prefixSlugs)
}

func (*cache) TopPostsKey(categoryUUID string) string {
	return fmt.Sprintf("%s:%s#%s", prefixCategory, prefixTopPosts, categoryUUID)
}

func (*cache) RedisEnabledKey() string {
	return fmt.Sprintf("%s:%s", prefixConfig, "redis_enabled")
}

func (*cache) CategoryUUIDKey(categoryUUID uuid.UUID) string {
	return fmt.Sprintf("%s-uuid#%s", prefixCategory, categoryUUID.String())
}

func (*cache) CategoryObjectKey(categoryUUID uuid.UUID) string {
	return fmt.Sprintf("%s-uuid#%s:object", prefixCategory, categoryUUID.String())
}

func (*cache) CategoryTopPostsKey(categoryUUID uuid.UUID) string {
	return fmt.Sprintf("%s:%s#%s", prefixCategory, prefixTopPosts, categoryUUID.String())
}
