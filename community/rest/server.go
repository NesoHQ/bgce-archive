package rest

import (
	"net/http"

	"community/rest/handlers"
	"community/rest/middlewares"
)

func NewServeMux(mw *middlewares.Middlewares, h *handlers.Handlers) (http.Handler, error) {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"community","version":"1.0.0"}`))
	})

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Community API - Comments & Discussions Service","version":"1.0.0","endpoints":{"/api/v1/health":"Health check","/api/v1/comments":"List comments","/api/v1/discussions":"List discussions"}}`))
	})

	mux.HandleFunc("GET /api/v1/comments", h.ListComments)
	mux.HandleFunc("GET /api/v1/discussions", h.ListDiscussions)

	manager := middlewares.NewManager()
	handler := manager.With(mux, mw.RateLimiter, middlewares.CORS, middlewares.Logger, middlewares.Recover)

	return handler, nil
}
