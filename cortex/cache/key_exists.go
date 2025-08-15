package cache

import (
	"context"
	"time"
)

func (r *cache) KeyExists(ctx context.Context, key string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	result, err := r.readClient.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return result == 1, nil
}
