package middlewares

import "context"

type Cache interface {
	Get(ctx context.Context, key string) (bool, error)
	RedisEnabledKey() string
}

type CortexSettings interface {
	UseRedisCache(context.Context) (bool, error)
}
