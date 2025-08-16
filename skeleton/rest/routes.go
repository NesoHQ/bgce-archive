package rest

import (
	"net/http"

	"servicetemplate/rest/middlewares"
)

func (server *Server) initRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"GET /api/v1/hello",
		manager.With(
			http.HandlerFunc(server.handlers.HelloHandler),
			// server.middlewares.AuthenticateJWT,
		),
	)
}
