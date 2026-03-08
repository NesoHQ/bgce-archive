package rest

import (
	"net/http"
)

func (server *Server) initRoutes(mux *http.ServeMux) {
	// Health check (public)
	mux.HandleFunc("GET /health", server.handlers.HealthHandler)

	// Media endpoints
	// Protected: Upload media (requires authentication)
	mux.HandleFunc("POST /api/v1/media/upload", func(w http.ResponseWriter, r *http.Request) {
		server.middlewares.AuthenticateJWT(http.HandlerFunc(server.handlers.UploadHandler)).ServeHTTP(w, r)
	})

	// Public: List media
	mux.HandleFunc("GET /api/v1/media", server.handlers.ListMediaHandler)

	// Public: Get media by ID
	mux.HandleFunc("GET /api/v1/media/{id}", server.handlers.GetMediaByIDHandler)

	// Public: Get media by UUID
	mux.HandleFunc("GET /api/v1/media/uuid/{uuid}", server.handlers.GetMediaByUUIDHandler)

	// Protected: Delete media (requires authentication)
	mux.HandleFunc("DELETE /api/v1/media/{id}", func(w http.ResponseWriter, r *http.Request) {
		server.middlewares.AuthenticateJWT(http.HandlerFunc(server.handlers.DeleteMediaHandler)).ServeHTTP(w, r)
	})

	// Public: Get user's media
	mux.HandleFunc("GET /api/v1/users/{user_id}/media", server.handlers.GetUserMediaHandler)

	// Protected: Optimize image (requires authentication)
	mux.HandleFunc("POST /api/v1/media/{id}/optimize", func(w http.ResponseWriter, r *http.Request) {
		server.middlewares.AuthenticateJWT(http.HandlerFunc(server.handlers.OptimizeImageHandler)).ServeHTTP(w, r)
	})
}
