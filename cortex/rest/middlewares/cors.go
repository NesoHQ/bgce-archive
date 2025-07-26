package middlewares

import (
	"net/http"

	"github.com/rs/cors"
)

func EnableCors(mux *http.ServeMux) http.Handler {
	c := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://*", "http://*"},
		AllowOriginFunc: func(origin string) bool { return true },
		AllowedMethods:  []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		// AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	return c.Handler(mux)
}
