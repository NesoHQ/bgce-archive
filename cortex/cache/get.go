package cache

import (
	"context"
	"fmt"

	"github.com/go-redis/redis"
	"go.elastic.co/apm"
)

func (c *cache) Get(ctx context.Context, key string) (string, error) {
	span, _ := apm.StartSpan(ctx, "Get", "redis")
	defer span.End()

	value, err := c.readClient.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return "", nil
		}
		return "", fmt.Errorf("failed to get value for key %q from redis: %w", key, err)
	}

	return value, err
}
