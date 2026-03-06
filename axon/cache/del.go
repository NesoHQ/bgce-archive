package cache

import (
	"context"
	"fmt"
)

func (c *cache) Del(ctx context.Context, keys ...string) error {
	if c.writeClient == nil || len(keys) == 0 {
		return nil
	}

	err := c.writeClient.Del(ctx, keys...).Err()
	if err != nil {
		return fmt.Errorf("failed to delete keys from redis: %w", err)
	}

	return nil
}
