package cmd 

import (
	"net/http"

	"ecommerce/handlers"
	"ecommerce/middleware"

)

func initRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	mux.Handle(
		"GET /rahim", 
		manager.With(
			http.HandlerFunc(handlers.Test),
			middleware.Arekta,
	),
)

	mux.Handle(
		"GET /habib", 
		manager.With(
			http.HandlerFunc(handlers.Test),
	),
)	

	mux.Handle("GET /products", 
		manager.With(
			http.HandlerFunc(handlers.GetProducts),
	),
)

	mux.Handle("POST /products", 
		manager.With(
			http.HandlerFunc(handlers.CreateProduct),
	),
) 
	
	mux.Handle("GET /products/{productId}", 
		manager.With(
			http.HandlerFunc(handlers.GetProductByID),
	),
)
	
}