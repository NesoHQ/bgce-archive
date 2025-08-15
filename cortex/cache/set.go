package cache

import (
	"context"
	"cortex/logger"
	"log/slog"
	"time"

	"go.elastic.co/apm"
)

func (c *cache) Set(ctx context.Context, key string, value any, expiration time.Duration) error {
	span, _ := apm.StartSpan(ctx, "Set", "redis")
	defer span.End()

	err := c.writeClient.Set(ctx, key, value, expiration).Err()
	if err != nil {
		slog.ErrorContext(ctx, "Failed to set value in redis", logger.Extra(map[string]any{
			"error": err.Error(),
			"key":   key,
		}))
		return err
	}

	return nil
}
