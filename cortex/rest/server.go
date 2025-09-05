package rest

import (
	"fmt"
	"net/http"

	"go.elastic.co/apm/module/apmhttp"

	"cortex/config"
	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/swagger"
)

func NewServer(mw *middlewares.Middlewares, cnf *config.Config, handlers *handlers.Handlers) (*http.Server, error) {
	mux := http.NewServeMux()
	manager := middlewares.NewManager()
	manager.Use(middlewares.Recover, middlewares.Logger, middlewares.CORS)

	mux.Handle("POST /api/v1/categories", manager.With(
		http.HandlerFunc(handlers.CreateCategory),
		mw.RedisToggle,
		mw.AuthenticateJWT,
	))
	mux.Handle("GET /api/v1/categories", http.HandlerFunc(handlers.GetCategoryList))
	mux.Handle("GET /api/v1/categories/{id}", http.HandlerFunc(handlers.GetCategoryByID))
	mux.Handle("PUT /api/v1/categories/{id}", http.HandlerFunc(handlers.UpdateCategory))
	mux.Handle("DELETE /api/v1/categories/{id}", http.HandlerFunc(handlers.DeleteCategory))

	mux.Handle("POST /api/v1/sub-categories", http.HandlerFunc(handlers.CreateSubCategory))
	mux.Handle("GET /api/v1/sub-categories", http.HandlerFunc(handlers.GetSubCategoryList))
	mux.Handle("GET /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.GetSubCategoryByID))
	mux.Handle("PUT /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.UpdateSubCategory))
	mux.Handle("DELETE /api/v1/sub-categories/{id}", http.HandlerFunc(handlers.DeleteSubCategory))

	swagger.SetupSwagger(mux, manager)
	return &http.Server{
		Addr:    fmt.Sprintf(":%d", cnf.HttpPort),
		Handler: apmhttp.Wrap(mux),
	}, nil
}
