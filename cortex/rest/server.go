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
	mux.Handle("GET /api/v1/categories", manager.With(http.HandlerFunc(handlers.GetCategoryList)))
	mux.Handle("GET /api/v1/categories/{category_uuid}", http.HandlerFunc(handlers.GetCategoryByUUID))
	mux.Handle("PUT /api/v1/categories/{slug}", manager.With(
		http.HandlerFunc(handlers.UpdateCategory),
		// mw.RedisToggle,
		mw.AuthenticateJWT,
	))

	mux.Handle("DELETE /api/v1/categories/{category_id}", manager.With(
		http.HandlerFunc(handlers.DeleteCategoryByID),
		mw.AuthenticateJWT,
	))

	mux.Handle("GET /api/v1/hello", http.HandlerFunc(handlers.Hello))

	mux.Handle("POST /api/v1/sub-categories", manager.With(
		http.HandlerFunc(handlers.CreateSubCategory),
		mw.AuthenticateJWT,
	))
	mux.Handle("GET /api/v1/sub-categories", http.HandlerFunc(handlers.GetSubCategoryList))
	mux.Handle("GET /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.GetSubCategoryByID))
	mux.Handle("PUT /api/v1/sub-categories/{id}", manager.With(
		http.HandlerFunc(handlers.UpdateSubCategory),
		mw.AuthenticateJWT,
	))
	mux.Handle("DELETE /api/v1/sub-categories/{id}", manager.With(
		http.HandlerFunc(handlers.DeleteSubCategory),
		mw.AuthenticateJWT,
	))

	swagger.SetupSwagger(mux, manager)

	return mux, nil
}
