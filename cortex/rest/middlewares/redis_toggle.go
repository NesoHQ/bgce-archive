package middlewares

import (
	"context"
	"log/slog"
	"net/http"
)

const (
	RedisEnabledKey contextKey = "redisEnabled"
)

func (m *Middlewares) RedisToggle(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var enabled bool

		val, err := m.cache.Get(r.Context(), m.cache.RedisEnabledKey())
		if err == nil {
			enabled = val
		} else {
			enabled, err = m.cortexSettings.UseRedisCache(r.Context())
			if err != nil {
				slog.Warn("Failed to get Redis toggle from cortexSettings, defaulting to false", "error", err)
				enabled = false
			}
		}

		ctx := WithRedisEnabled(r.Context(), enabled)
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
