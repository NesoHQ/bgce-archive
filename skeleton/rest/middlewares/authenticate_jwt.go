package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	"servicetemplate/rest/utils"
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
)

type AuthClaims struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
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

		var claims AuthClaims
		token, err := jwt.ParseWithClaims(
			tokenStr,
			&claims,
			func(t *jwt.Token) (interface{}, error) {
				// return []byte(m.Cnf.JwtSecret), nil
				return nil, nil
			},
		)
		if err != nil {
			unauthorizedResponse(w, "Invalid token: "+err.Error())
			return
		}

		if !token.Valid {
			unauthorizedResponse(w, "Token is not valid")
			return
		}

		// if claims.ExpiresAt.Time.Before(time.Now()) {
		// 	unauthorizedResponse(w, "Token has expired")
		// 	return
		// }

		ctx := context.WithValue(r.Context(), UserIdKey, claims.Id)
		ctx = context.WithValue(ctx, UserNameKey, claims.Name)
		ctx = context.WithValue(ctx, UserEmailKey, claims.Email)

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
