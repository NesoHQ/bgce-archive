package cache

import (
	"context"
	"log"
	"time"
)

func (c *cache) Set(ctx context.Context, key string, value any, expiration time.Duration) error {
	if c.writeClient == nil {
		return nil
	}

	// Add timeout to prevent hanging requests
	ctx, cancel := context.WithTimeout(ctx, 200*time.Millisecond)
	defer cancel()

	err := c.writeClient.Set(ctx, key, value, expiration).Err()
	if err != nil {
		log.Printf("Failed to set value in redis for key %s: %v", key, err)
		return err
	}

	return nil
}
