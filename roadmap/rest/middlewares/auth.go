package middlewares

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"roadmap/auth"
)

type contextKey string

const (
	UserIDKey   contextKey = "user_id"
	UsernameKey contextKey = "username"
	EmailKey    contextKey = "email"
	RoleKey     contextKey = "role"
)

func (m *Middlewares) AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			respondWithError(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Extract token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			respondWithError(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		// Validate JWT token using the same secret as cortex
		claims, err := auth.ValidateToken(tokenString, m.jwtSecret)
		if err != nil {
			respondWithError(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Add user information to context
		ctx := r.Context()
		ctx = context.WithValue(ctx, UserIDKey, uint(claims.UserID))
		ctx = context.WithValue(ctx, UsernameKey, claims.Username)
		ctx = context.WithValue(ctx, EmailKey, claims.Email)
		ctx = context.WithValue(ctx, RoleKey, claims.Role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserID(r *http.Request) uint {
	if userID, ok := r.Context().Value(UserIDKey).(uint); ok {
		return userID
	}
	return 0
}

func GetUsername(r *http.Request) string {
	if username, ok := r.Context().Value(UsernameKey).(string); ok {
		return username
	}
	return ""
}

func GetEmail(r *http.Request) string {
	if email, ok := r.Context().Value(EmailKey).(string); ok {
		return email
	}
	return ""
}

func GetRole(r *http.Request) string {
	if role, ok := r.Context().Value(RoleKey).(string); ok {
		return role
	}
	return ""
}

func respondWithError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]any{
		"success": false,
		"message": message,
	})
}
