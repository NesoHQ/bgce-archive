package cache

import (
	"context"
	"fmt"
)

// DelPattern deletes all keys matching the given pattern using SCAN
func (c *cache) DelPattern(ctx context.Context, pattern string) error {
	if c.writeClient == nil || pattern == "" {
		return nil
	}

	// Use SCAN to find all matching keys
	var cursor uint64
	var keys []string

	for {
		var scanKeys []string
		var err error

		scanKeys, cursor, err = c.writeClient.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			return fmt.Errorf("failed to scan keys: %w", err)
		}

		keys = append(keys, scanKeys...)

		// Break when cursor returns to 0 (scan complete)
		if cursor == 0 {
			break
		}
	}

	// Delete all found keys
	if len(keys) > 0 {
		if err := c.writeClient.Del(ctx, keys...).Err(); err != nil {
			return fmt.Errorf("failed to delete keys: %w", err)
		}
	}

	return nil
}
