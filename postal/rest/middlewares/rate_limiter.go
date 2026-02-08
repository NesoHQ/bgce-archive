package middlewares

import (
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/ulule/limiter/v3"
)

func (m *Middlewares) RateLimiter(next http.Handler) http.Handler {
	// Create limiter for IP with 100 req/min
	rate := limiter.Rate{
		Limit:  100,
		Period: time.Minute,
	}
	instance := limiter.New(m.IPStore, rate)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clientIP := strings.Split(r.RemoteAddr, ":")[0]

		context, err := instance.Get(r.Context(), clientIP)
		if err != nil {
			slog.ErrorContext(r.Context(), "Rate limiter error", "error", err)
			next.ServeHTTP(w, r)
			return
		}

		if context.Reached {
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error": "Too many requests. Please try again later."}`))
			return
		}

		next.ServeHTTP(w, r)
	})
}
