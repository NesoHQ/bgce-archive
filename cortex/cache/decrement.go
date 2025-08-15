package cache

import (
	"context"
	"fmt"

	"go.elastic.co/apm"
)

func (c *cache) Decrement(ctx context.Context, key string) (int64, error) {
	span, _ := apm.StartSpan(ctx, "Decrement", "redis")
	defer span.End()

	decrementedValue, err := c.writeClient.Decr(ctx, key).Result()
	if err != nil {
		return 0, fmt.Errorf("failed to decrement value: %w", err)
	}

	return decrementedValue, nil
}
