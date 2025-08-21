package middleware

import (
	"net/http"
)

func Preflight(next http.Handler) http.Handler {
	return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(200)
			return  
		}
		
		next.ServeHTTP(w, r)
	})
}