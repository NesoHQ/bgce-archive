package cmd

import (
	"ecommerce/global_router"
	"ecommerce/handlers"
	"fmt"
	"net/http"
)

func Serve() {
	mux := http.NewServeMux() //router

	mux.Handle("GET /products", http.HandlerFunc(handlers.GetProducts))
	mux.Handle("GET /products/{productID}", http.HandlerFunc(handlers.GetProductByID))
	mux.Handle("POST /products", http.HandlerFunc(handlers.CreatProduct))

	fmt.Println("Server is runing at port :8080")

	err := http.ListenAndServe(":8080", global_router.GlobalRouter(mux)) //"Failed to start the server"

	if err != nil {
		fmt.Println("Error starting the server", err)
	}
}
