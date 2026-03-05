package cache

import (
	"context"
	"fmt"
)

// Flush clears the entire Redis database
func (c *cache) Flush(ctx context.Context) error {
	if c.writeClient == nil {
		return nil
	}

	if err := c.writeClient.FlushDB(ctx).Err(); err != nil {
		return fmt.Errorf("failed to flush redis: %w", err)
	}

	return nil
}
