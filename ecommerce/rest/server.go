package rest

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"ecommerce/rest/middlewares"
	"ecommerce/config"
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

	
	
	addr := ":" + strconv.Itoa(cnf.HttpPort)
	fmt.Println("Server running on port: ", addr)
	err := http.ListenAndServe(addr, wrappedMux) //" Failed to start the server"
	if err != nil {
		fmt.Println("Error starting the server", err)
		os.Exit(1)
	}
}