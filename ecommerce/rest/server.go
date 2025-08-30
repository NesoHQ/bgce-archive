package rest

import (
	"fmt"
	"net/http"
	"strconv"

	"ecommerce/config"
	middleware "ecommerce/rest/middlewares"
)

func Start(cnf config.Config) {
	manager := middleware.NewManager()
	manager.Use(
		middleware.Preflight,
		middleware.Cors,
		middleware.Logger,
	)

	mux := http.NewServeMux()
	wrappedMux := manager.WrapMux(mux)

	initRoutes(mux, manager)

	addr := ":" + strconv.Itoa(cnf.HttpPort) // type casting

	fmt.Println("Server running on port :", addr)
	err := http.ListenAndServe(addr, wrappedMux) //" Failed to start the server"
	if err != nil {
		fmt.Println("Error starting the server", err)
	}
}
