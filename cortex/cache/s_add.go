package cache

import (
	"context"
	"time"
)

func (c *cache) SAdd(ctx context.Context, key string, ttl time.Duration, members ...any) error {
	if len(members) == 0 {
		return nil
	}

	if err := c.writeClient.SAdd(ctx, key, members...).Err(); err != nil {
		return err
	}

	return c.writeClient.Expire(ctx, key, ttl).Err()
}
