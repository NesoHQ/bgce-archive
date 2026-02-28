package rest

import (
	"net/http"

	"postal/rest/handlers"
	"postal/rest/middlewares"
	"postal/rest/swagger"
)

func NewServeMux(mw *middlewares.Middlewares, h *handlers.Handlers) (http.Handler, error) {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"postal","version":"1.0.0"}`))
	})

	// Root endpoint
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Postal API - Archive Posts Service","version":"1.0.0","endpoints":{"/api/v1/health":"Health check","/api/v1/posts":"List posts"}}`))
	})

	// Post routes
	// Public routes
	mux.HandleFunc("GET /api/v1/posts", h.ListPosts)
	mux.HandleFunc("GET /api/v1/posts/{id}", h.GetPostByID)
	mux.HandleFunc("GET /api/v1/posts/slug/{slug}", h.GetPostBySlug)

	// Protected routes
	mux.HandleFunc("POST /api/v1/posts", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.CreatePost)).ServeHTTP(w, r)
	})
	mux.HandleFunc("POST /api/v1/posts/batch", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.BatchUploadPosts)).ServeHTTP(w, r)
	})
	mux.HandleFunc("PUT /api/v1/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.UpdatePost)).ServeHTTP(w, r)
	})
	mux.HandleFunc("DELETE /api/v1/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.DeletePost)).ServeHTTP(w, r)
	})

	mux.HandleFunc("DELETE /api/v1/posts/batch", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.BatchDeletePosts)).ServeHTTP(w, r)
	})

	// Post action routes (protected)
	mux.HandleFunc("POST /api/v1/posts/{id}/publish", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.PublishPost)).ServeHTTP(w, r)
	})
	mux.HandleFunc("POST /api/v1/posts/{id}/unpublish", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.UnpublishPost)).ServeHTTP(w, r)
	})
	mux.HandleFunc("POST /api/v1/posts/{id}/archive", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(h.ArchivePost)).ServeHTTP(w, r)
	})

	// Setup swagger with its own middleware manager
	swaggerManager := middlewares.NewManager()
	swaggerManager.Use(middlewares.Recover, middlewares.Logger, middlewares.CORS)
	swagger.SetupSwagger(mux, swaggerManager)

	// Apply global middlewares to all routes (including swagger)
	// Order: RateLimiter (outermost) -> CORS -> Logger -> Recover -> Routes (innermost)
	manager := middlewares.NewManager()
	handler := manager.With(mux, mw.RateLimiter, middlewares.CORS, middlewares.Logger, middlewares.Recover)

	return handler, nil
}
