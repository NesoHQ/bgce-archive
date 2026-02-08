package middlewares

import (
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/ulule/limiter/v3"
)

func (m *Middlewares) RateLimiter(next http.Handler) http.Handler {
	// Create limiters for IP and User
	ipRate := limiter.Rate{
		Limit:  100,         // 100 requests
		Period: time.Minute, // per 1 minute
	}
	ipLimiter := limiter.New(m.IPStore, ipRate)

	authRate := limiter.Rate{
		Limit:  5,           // 5 requests
		Period: time.Minute, // per 1 minute
	}
	authLimiter := limiter.New(m.AuthStore, authRate)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Use RemoteAddr for IP-based limiting
		// NOTE: In production behind a proxy, we should use X-Forwarded-For
		clientIP := strings.Split(r.RemoteAddr, ":")[0]

		// 1. Global IP Limit
		context, err := ipLimiter.Get(r.Context(), clientIP)
		if err != nil {
			slog.ErrorContext(r.Context(), "Rate limiter error", "error", err)
			next.ServeHTTP(w, r)
			return
		}

		if context.Reached {
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error": "Too many requests from this IP. Please try again later."}`))
			return
		}

		// 2. Auth Endpoint Limit (Login/Register)
		if r.URL.Path == "/api/v1/auth/login" || r.URL.Path == "/api/v1/auth/register" {
			authCtx, err := authLimiter.Get(r.Context(), clientIP)
			if err != nil {
				slog.ErrorContext(r.Context(), "Auth rate limiter error", "error", err)
			} else if authCtx.Reached {
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"error": "Too many login/register attempts. Please try again later."}`))
				return
			}
		}

		// 3. User-based Limit (if authenticated)
		// Assuming AuthenticateJWT sets some user context that we can use
		// For now, we'll check if there's a user ID in context or header (simplified)
		// In a real scenario, this middleware should be placed AFTER AuthenticateJWT if we want per-user limiting
		// But usually global limits are placed early.

		// If we want per-user limiting, we might need to extract the user ID
		// For now, let's keep it IP-based and Auth-endpoint based as requested for DDoS protection.

		next.ServeHTTP(w, r)
	})
}
