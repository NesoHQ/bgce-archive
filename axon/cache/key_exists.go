package cache

import (
	"context"
	"fmt"
)

func (c *cache) Exists(ctx context.Context, keys ...string) (int64, error) {
	if c.readClient == nil || len(keys) == 0 {
		return 0, nil
	}

	count, err := c.readClient.Exists(ctx, keys...).Result()
	if err != nil {
		return 0, fmt.Errorf("failed to check key existence in redis: %w", err)
	}

	return count, nil
}
