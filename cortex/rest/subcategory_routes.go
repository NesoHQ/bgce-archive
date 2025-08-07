package rest

import (
	"net/http"

	"cortex/rest/middlewares"
)

func (server *Server) initSubCtgryRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /api/v1/sub-categories",
		manager.With(
			http.HandlerFunc(server.handlers.CreateSubCategory),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /api/v1/sub-categories",
		manager.With(
			http.HandlerFunc(server.handlers.GetSubCategoryList),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /api/v1/sub-categories/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.GetSubCategoryByID),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"PUT /api/v1/sub-categories/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.UpdateSubCategory),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"DELETE /api/v1/sub-categories/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.DeleteSubCategory),
			// server.middlewares.AuthenticateJWT,
		),
	)
}
