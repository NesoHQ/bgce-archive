package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func (c *cache) ZAdd(ctx context.Context, key string, ttl time.Duration, members ...any) error {
	if len(members) == 0 {
		_, err := c.writeClient.ZAdd(ctx, key, redis.Z{Score: 0, Member: "__init__"}).Result()
		if err != nil {
			return err
		}

		return c.writeClient.Expire(ctx, key, ttl).Err()
	}

	redisMembers := make([]redis.Z, len(members))
	for i, m := range members {
		z, ok := m.(redis.Z)
		if !ok {
			return fmt.Errorf("member at index %d is not of type redis.Z", i)
		}
		redisMembers[i] = z
	}

	if _, err := c.writeClient.ZAdd(ctx, key, redisMembers...).Result(); err != nil {
		return err
	}

	return c.writeClient.Expire(ctx, key, ttl).Err()
}
