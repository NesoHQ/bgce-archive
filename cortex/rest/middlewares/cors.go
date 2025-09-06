package middlewares

import (
	"net/http"

	"github.com/rs/cors"
)

func CORS(next http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c.Handler(next).ServeHTTP(w, r)
	})
}
