package middlewares

import "context"

type Cache interface {
	Get(ctx context.Context, key string) (string, error)
	RedisEnabledKey() string
}

type CortexConfig struct {
	UseRedisCache bool
}
