package cache

import (
	"context"
	"encoding/json"
	"time"
)

func (c *cache) SetJSON(ctx context.Context, key string, value any, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.writeClient.Set(ctx, key, data, ttl).Err()
}
