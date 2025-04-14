package rest

import (
	"fmt"
	"net/http"
	"sync"

	"go.elastic.co/apm/module/apmhttp"

	"rbac/rest/middlewares"
)

type Server struct {
	Wg sync.WaitGroup
}

func NewServer() (*Server, error) {
	server := &Server{}

	return server, nil
}

func (server *Server) Start() {
	mux := http.NewServeMux()
	muxHandler := middlewares.EnableCors(mux)

	server.initRoutes(mux)

	server.Wg.Add(1)
	go func() {
		defer server.Wg.Done()

		addr := fmt.Sprintf(":%d", 4000)
		fmt.Printf("Server Listening on port: %s...\n", addr)

		if err := http.ListenAndServe(addr, apmhttp.Wrap(muxHandler)); err != nil {
			fmt.Println(err)
		}
	}()
}
