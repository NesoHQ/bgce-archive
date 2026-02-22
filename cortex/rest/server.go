package rest

import (
	"net/http"

	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/swagger"
)

func NewServeMux(mw *middlewares.Middlewares, handlers *handlers.Handlers) (http.Handler, error) {
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

	// Tenant routes
	mux.HandleFunc("GET /api/v1/tenants/by-domain/{identifier}", handlers.GetTenantByDomain)
	mux.HandleFunc("GET /api/v1/tenants", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.GetTenants)).ServeHTTP(w, r)
	})
	mux.HandleFunc("POST /api/v1/tenants", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.CreateTenant)).ServeHTTP(w, r)
	})
	mux.HandleFunc("PUT /api/v1/tenants/{id}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.UpdateTenant)).ServeHTTP(w, r)
	})
	mux.HandleFunc("DELETE /api/v1/tenants/{id}", func(w http.ResponseWriter, r *http.Request) {
		mw.AuthenticateJWT(http.HandlerFunc(handlers.DeleteTenant)).ServeHTTP(w, r)
	})

	// Health check
	mux.HandleFunc("GET /api/v1/hello", handlers.Hello)

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
