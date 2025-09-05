package middlewares

import (
	"context"
	"net/http"
)

const (
	RedisEnabledKey contextKey = "redisEnabled"
)

func (m *Middlewares) RedisToggle(next http.Handler) http.Handler {
	if !m.cortexSettings.UseRedisCache {
		return next
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := WithRedisEnabled(r.Context(), true)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func WithRedisEnabled(ctx context.Context, enabled bool) context.Context {
	return context.WithValue(ctx, RedisEnabledKey, enabled)
}

func IsRedisEnabled(ctx context.Context) bool {
	val, ok := ctx.Value(RedisEnabledKey).(bool)
	return ok && val
}
