package middlewares

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"cortex/rest/utils"

	"github.com/golang-jwt/jwt/v5"
)

const (
	AUTHORIZATION_HEADER = "authorization"
	AUTH_QUERY           = "auth"
)

type contextKey string

const (
	UserIdKey    contextKey = "userId"
	UserNameKey  contextKey = "userName"
	UserEmailKey contextKey = "userEmail"
	UserRoleKey  contextKey = "userRole"
	IsAdminKey   contextKey = "isAdmin"
)

type authClaims struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Role    string `json:"role"`
	IsAdmin bool   `json:"is_admin"`
	jwt.RegisteredClaims
}

func unauthorizedResponse(w http.ResponseWriter, message string) {
	utils.SendError(w, http.StatusUnauthorized, "Unauthorized: "+message, nil)
}

func (m *Middlewares) AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get(AUTHORIZATION_HEADER)
		var tokenStr string

		if header != "" {
			tokens := strings.Split(header, " ")
			if len(tokens) != 2 || tokens[0] != "Bearer" {
				unauthorizedResponse(w, "Invalid Authorization format")
				return
			}
			tokenStr = tokens[1]
		} else {
			tokenStr = r.URL.Query().Get(AUTH_QUERY)
		}

		if tokenStr == "" {
			unauthorizedResponse(w, "Missing token")
			return
		}

		var claims authClaims
		token, err := jwt.ParseWithClaims(tokenStr, &claims, func(t *jwt.Token) (any, error) {
			return []byte(m.Cnf.JwtSecret), nil
		})
		if err != nil {
			unauthorizedResponse(w, "Invalid token: "+err.Error())
			return
		}

		if !token.Valid {
			unauthorizedResponse(w, "Token is not valid")
			return
		}

		userID, err := strconv.Atoi(claims.Subject)
		if err != nil {
			unauthorizedResponse(w, "JWT subject is not a valid user ID. Expected numeric string.")
			return
		}

		ctx := context.WithValue(r.Context(), UserIdKey, userID)
		ctx = context.WithValue(ctx, UserNameKey, claims.Name)
		ctx = context.WithValue(ctx, UserEmailKey, claims.Email)
		ctx = context.WithValue(ctx, UserRoleKey, claims.Role)
		ctx = context.WithValue(ctx, IsAdminKey, claims.IsAdmin)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserId(r *http.Request) int {
	userId, _ := r.Context().Value(UserIdKey).(int)
	return userId
}

func GetUserName(r *http.Request) string {
	userName, _ := r.Context().Value(UserNameKey).(string)
	return userName
}

func GetUserEmail(r *http.Request) string {
	userEmail, _ := r.Context().Value(UserEmailKey).(string)
	return userEmail
}

func GetUserRole(r *http.Request) string {
	role, _ := r.Context().Value(UserRoleKey).(string)
	return role
}

func IsAdmin(r *http.Request) bool {
	isAdmin, _ := r.Context().Value(IsAdminKey).(bool)
	return isAdmin
}
