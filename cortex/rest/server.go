package rest

import (
	"net/http"

	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/swagger"
)

func NewServeMux(mw *middlewares.Middlewares, handlers *handlers.Handlers) (*http.ServeMux, error) {
	mux := http.NewServeMux()
	manager := middlewares.NewManager()
	manager.Use(middlewares.Recover, middlewares.Logger, middlewares.CORS)

	mux.Handle("POST /api/v1/categories", manager.With(
		http.HandlerFunc(handlers.CreateCategory),
		// mw.RedisToggle,
		mw.AuthenticateJWT,
	))
	mux.Handle("GET /api/v1/categories", http.HandlerFunc(handlers.GetCategoryList))
	mux.Handle("GET /api/v1/categories/{category_uuid}", http.HandlerFunc(handlers.GetCategoryByUUID))
	mux.Handle("PUT /api/v1/categories/{slug}", manager.With(
		http.HandlerFunc(handlers.UpdateCategory),
		// mw.RedisToggle,
		mw.AuthenticateJWT,
	))
	mux.Handle("DELETE /api/v1/categories/{category_id}", http.HandlerFunc(handlers.DeleteCategoryByID))

	mux.Handle("POST /api/v1/sub-categories", http.HandlerFunc(handlers.CreateSubCategory))
	mux.Handle("GET /api/v1/sub-categories", http.HandlerFunc(handlers.GetSubCategoryList))
	mux.Handle("GET /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.GetSubCategoryByID))
	mux.Handle("PUT /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.UpdateSubCategory))
	mux.Handle("DELETE /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.DeleteSubCategory))

	swagger.SetupSwagger(mux, manager)

	return mux, nil
}
