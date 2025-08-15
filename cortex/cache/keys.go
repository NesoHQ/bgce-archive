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

type (
	CategoryKeys struct{}
	ConfigKeys   struct{}
)

var (
	Category = CategoryKeys{}
	Config   = ConfigKeys{}
)

func (k CategoryKeys) SlugsKey() string {
	return fmt.Sprintf("%s:%s", prefixCategory, prefixSlugs)
}

func (k CategoryKeys) TopPostsKey(categoryUUID string) string {
	return fmt.Sprintf("%s:%s#%s", prefixCategory, prefixTopPosts, categoryUUID)
}

func (k ConfigKeys) RedisEnabledKey() string {
	return fmt.Sprintf("%s:%s", prefixConfig, "redis_enabled")
}

func (k CategoryKeys) CategoryUUIDKey(categoryUUID uuid.UUID) string {
	return fmt.Sprintf("%s-uuid#%s", prefixCategory, categoryUUID.String())
}

func (k CategoryKeys) CategoryObjectKey(categoryUUID uuid.UUID) string {
	return fmt.Sprintf("%s-uuid#%s:object", prefixCategory, categoryUUID.String())
}

func (k CategoryKeys) CategoryTopPostsKey(categoryUUID uuid.UUID) string {
	return fmt.Sprintf("%s:%s#%s", prefixCategory, prefixTopPosts, categoryUUID.String())
}
