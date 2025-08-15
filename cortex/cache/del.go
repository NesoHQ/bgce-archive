package cache

import (
	"context"
	"fmt"

	"go.elastic.co/apm"
)

func (c *cache) Del(ctx context.Context, key string) error {
	span, _ := apm.StartSpan(ctx, "Del", "redis")
	defer span.End()

	_, err := c.writeClient.Del(ctx, key).Result()
	if err != nil {
		return fmt.Errorf("failed to delete key %q from redis: %w", key, err)
	}

	return nil
}
