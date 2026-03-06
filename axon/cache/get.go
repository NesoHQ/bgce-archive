package cache

import (
	"context"
	"fmt"
	"time"

	goRedis "github.com/redis/go-redis/v9"
)

func (c *cache) Get(ctx context.Context, key string) (string, error) {
	if c.readClient == nil {
		return "", nil
	}

	// Add timeout to prevent hanging requests
	// Increased from 100ms to 1s to allow for connection establishment
	// The Redis client's ReadTimeout (2s) will handle actual slow queries
	ctx, cancel := context.WithTimeout(ctx, 1*time.Second)
	defer cancel()

	value, err := c.readClient.Get(ctx, key).Result()
	if err != nil {
		if err == goRedis.Nil {
			return "", nil // Cache miss
		}
		return "", fmt.Errorf("failed to get value for key %q from redis: %w", key, err)
	}

	return value, nil
}
