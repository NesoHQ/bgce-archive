package cmd  

import (
	"fmt"
	"net/http"


	"ecommerce/middleware"	
)

func Serve(){
	

	manager := middleware.NewManager()
	manager.Use(
		middleware.Preflight,
		middleware.Cors,
		middleware.Logger,
	)

	mux := http.NewServeMux()	
	wrappedMux := manager.WrapMux(mux)


	initRoutes(mux, manager)

	fmt.Println("Server running on port :8080")
	err := http.ListenAndServe(":8080", wrappedMux) //" Failed to start the server"
	if err != nil {
		fmt.Println("Error starting the server", err)
	}
}