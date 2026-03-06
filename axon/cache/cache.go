package cache

import (
	"context"
	"time"

	goRedis "github.com/redis/go-redis/v9"
)

// Cache provides generic caching operations
// Services implement their own caching logic using these primitives
type Cache interface {
	Set(ctx context.Context, key string, value any, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, keys ...string) error
	DelPattern(ctx context.Context, pattern string) error
	Exists(ctx context.Context, keys ...string) (int64, error)
}

type cache struct {
	readClient  goRedis.Cmdable
	writeClient goRedis.Cmdable
}

func NewCache(readClient goRedis.Cmdable, writeClient goRedis.Cmdable) Cache {
	return &cache{
		readClient:  readClient,
		writeClient: writeClient,
	}
}
