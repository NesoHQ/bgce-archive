package cache

import (
	"context"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRedisSetGet(t *testing.T) {
	redisURL := os.Getenv("WRITE_REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://:password@localhost:6379"
	}

	client, err := NewRedisClient(redisURL, false)
	assert.NoError(t, err)
	assert.NotNil(t, client)

	cache := NewCache(client, client)

	type testCase struct {
		key   string
		value string
	}

	tests := []testCase{
		{key: "test:case:1", value: "hello"},
		{key: "test:case:2", value: "world"},
		{key: "test:case:3", value: "123"},
		{key: "test:case:4", value: ""},
	}

	ctx := context.Background()

	for _, tc := range tests {
		t.Run(tc.key, func(t *testing.T) {
			err := client.Set(ctx, tc.key, tc.value, 0).Err()
			assert.NoError(t, err)

			result, err := client.Get(ctx, tc.key).Result()
			assert.NoError(t, err)
			assert.Equal(t, tc.value, result)

			_ = client.Del(ctx, tc.key).Err()
		})
	}

	_ = cache
}
