package rest

import (
	"net/http"

	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/swagger"
)

func NewServeMux(mw *middlewares.Middlewares, handlers *handlers.Handlers) (*http.ServeMux, error) {
	mux := http.NewServeMux()

	// Auth routes (public)
	mux.HandleFunc("POST /api/v1/auth/register", handlers.Register)
	mux.HandleFunc("POST /api/v1/auth/login", handlers.Login)

	// User routes (protected)
	mux.HandleFunc("GET /api/v1/users/profile", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.GetProfile)).ServeHTTP(w, r)
	})
	mux.HandleFunc("PUT /api/v1/users/profile", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.UpdateProfile)).ServeHTTP(w, r)
	})
	mux.HandleFunc("POST /api/v1/users/change-password", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.ChangePassword)).ServeHTTP(w, r)
	})

	// Category routes
	mux.HandleFunc("POST /api/v1/categories", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.CreateCategory)).ServeHTTP(w, r)
	})
	mux.HandleFunc("GET /api/v1/categories", handlers.GetCategoryList)
	mux.HandleFunc("GET /api/v1/categories/{category_uuid}", handlers.GetCategoryByUUID)
	mux.HandleFunc("PUT /api/v1/categories/{slug}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.UpdateCategory)).ServeHTTP(w, r)
	})
	mux.HandleFunc("DELETE /api/v1/categories/{category_id}", handlers.DeleteCategoryByID)

	// Subcategory routes
	mux.HandleFunc("POST /api/v1/sub-categories", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.CreateSubCategory)).ServeHTTP(w, r)
	})
	mux.HandleFunc("GET /api/v1/sub-categories", handlers.GetSubCategoryList)
	mux.HandleFunc("GET /api/v1/sub-categories/{id}", handlers.GetSubCategoryByID)
	mux.HandleFunc("PUT /api/v1/sub-categories/{id}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.UpdateSubCategory)).ServeHTTP(w, r)
	})
	mux.HandleFunc("DELETE /api/v1/sub-categories/{id}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.DeleteSubCategory)).ServeHTTP(w, r)
	})

	// Health check
	mux.HandleFunc("GET /api/v1/hello", handlers.Hello)

	// Setup swagger
	manager := middlewares.NewManager()
	manager.Use(middlewares.Recover, middlewares.Logger, middlewares.CORS)
	swagger.SetupSwagger(mux, manager)

	return mux, nil
}

// WrapWithCORS wraps the entire mux with CORS middleware
func WrapWithCORS(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for all requests
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-CSRF-Token, X-Requested-With, Origin")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "300")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Call the next handler
		handler.ServeHTTP(w, r)
	})
}
