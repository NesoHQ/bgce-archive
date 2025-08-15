package cache

import (
	"context"

	"github.com/go-redis/redis"
)

func (c *cache) SIsMember(ctx context.Context, key, member string) (bool, error) {
	exists, err := c.readClient.SIsMember(ctx, key, member).Result()
	if err != nil {
		if err == redis.Nil {
			return false, nil
		}
		return false, err
	}
	return exists, nil
}
