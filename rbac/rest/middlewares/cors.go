package middlewares

import (
	"net/http"

	"github.com/rs/cors"
)

func EnableCors(mux *http.ServeMux) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowCredentials: true,
	})

	return c.Handler(mux)
}
