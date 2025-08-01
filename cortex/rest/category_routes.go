package rest

import (
	"net/http"

	"cortex/rest/middlewares"
)

func (server *Server) initCtgryRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /api/v1/categories",
		manager.With(
			http.HandlerFunc(server.handlers.CreateCategory),
			server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /api/v1/categories",
		manager.With(
			http.HandlerFunc(server.handlers.GetCategoryList),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /api/v1/categories/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.GetCategoryByID),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"PUT /api/v1/categories/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.UpdateCategory),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"DELETE /api/v1/categories/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.DeleteCategory),
			// server.middlewares.AuthenticateJWT,
		),
	)
}
