package rest

import (
	"net/http"
	"roadmap/rest/handlers"
	"roadmap/rest/middlewares"
)

func NewServer(mw *middlewares.Middlewares, h *handlers.Handlers) (http.Handler, error) {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":true,"service":"roadmap","version":"1.0.0"}`))
	})

	// Roadmap routes (JWT protected)
	mux.Handle("POST /api/v1/roadmap/planned", mw.AuthenticateJWT(http.HandlerFunc(h.AddPlannedCard)))
	manager := middlewares.NewManager()
	handler := manager.With(mux, middlewares.Recover, mw.RateLimiter, middlewares.CORS, middlewares.Logger)

	return handler, nil
}
