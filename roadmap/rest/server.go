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

	// Roadmap routes (public)
	mux.Handle("GET /api/v1/planned", http.HandlerFunc(h.GetPlannedCards))
	mux.Handle("GET /api/v1/in-progress", http.HandlerFunc(h.GetInProgressCards))
	mux.Handle("GET /api/v1/completed", http.HandlerFunc(h.GetCompletedCards))

	// Roadmap routes (JWT protected)
	mux.Handle("POST /api/v1/planned", mw.AuthenticateJWT(http.HandlerFunc(h.AddPlannedCard)))
	mux.Handle("PATCH /api/v1/start/{id}", mw.AuthenticateJWT(http.HandlerFunc(h.MoveCardToInProgress)))
	mux.Handle("PATCH /api/v1/complete/{id}", mw.AuthenticateJWT(http.HandlerFunc(h.MoveCardToCompleted)))
	manager := middlewares.NewManager()
	handler := manager.With(mux, middlewares.Recover, mw.RateLimiter, middlewares.CORS, middlewares.Logger)

	return handler, nil
}
