package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis"
	"go.elastic.co/apm"
)

func (c *cache) Get(ctx context.Context, key string) (string, error) {
	// Only create APM span if tracer is actually configured
	if apm.DefaultTracer.Active() {
		span, spanCtx := apm.StartSpan(ctx, "Get", "redis")
		defer span.End()
		ctx = spanCtx
	}

	// Add timeout to prevent hanging requests
	// Increased from 100ms to 1s to allow for connection establishment
	// The Redis client's ReadTimeout (2s) will handle actual slow queries
	timeoutCtx, cancel := context.WithTimeout(ctx, 1*time.Second)
	defer cancel()

	value, err := c.readClient.Get(timeoutCtx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return "", nil
		}
		return "", fmt.Errorf("failed to get value for key %q from redis: %w", key, err)
	}

	return value, err
}
