package rest

import (
	"fmt"
	"log/slog"
	"net/http"
	"sync"

	"media/config"
	"media/rest/handlers"
	"media/rest/middlewares"
	"media/rest/swagger"

	"go.elastic.co/apm/module/apmhttp"
)

type Server struct {
	middlewares *middlewares.Middlewares
	handlers    *handlers.Handlers
	cnf         *config.Config
	Wg          sync.WaitGroup
}

func NewServer(middlewares *middlewares.Middlewares, cnf *config.Config, handlers *handlers.Handlers) (*Server, error) {
	server := &Server{
		middlewares: middlewares,
		cnf:         cnf,
		handlers:    handlers,
	}

	return server, nil
}

func (server *Server) Start() {
	manager := middlewares.NewManager()

	manager.Use(
		middlewares.Recover,
		middlewares.Logger,
	)

	mux := http.NewServeMux()

	server.initRoutes(mux)

	handler := middlewares.EnableCors(mux)

	swagger.SetupSwagger(mux, manager)

	server.Wg.Add(1)

	go func() {
		defer server.Wg.Done()

		addr := fmt.Sprintf(":%d", server.cnf.HttpPort)
		slog.Info(fmt.Sprintf("Media Service listening at %s", addr))

		if err := http.ListenAndServe(addr, apmhttp.Wrap(handler)); err != nil {
			slog.Error(err.Error())
		}
	}()
}
