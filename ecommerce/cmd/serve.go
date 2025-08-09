package cmd  

import (
	"fmt"
	"net/http"

	
	"ecommerce/global_router"
	"ecommerce/handlers"
)

func Serve(){
	mux := http.NewServeMux() 

	mux.Handle("GET /products", http.HandlerFunc(handlers.GetProducts))
	mux.Handle("POST /products", http.HandlerFunc(handlers.CreateProduct))
	mux.Handle("GET /products/{productId}", http.HandlerFunc(handlers.GetProductByID))
	
	fmt.Println("Server running on port :8080")

	globalRouter := global_router.GlobalRouter(mux)

	err := http.ListenAndServe(":8080", globalRouter) //" Failed to start the server"
	if err != nil {
		fmt.Println("Error starting the server", err)
	}
}