package cmd  

import (
	"fmt"
	"net/http"

	
	"ecommerce/global_router"
	"ecommerce/middleware"
	
)

func Serve(){
	manager := middleware.NewManager()

	manager.Use(middleware.Logger, middleware.Hudai)

	mux := http.NewServeMux()

	initRoutes(mux, manager)

	globalRouter := global_router.GlobalRouter(mux)

	fmt.Println("Server running on port :8080")
	err := http.ListenAndServe(":8080", globalRouter) //" Failed to start the server"
	if err != nil {
		fmt.Println("Error starting the server", err)
	}
}