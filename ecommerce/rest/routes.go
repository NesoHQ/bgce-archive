package rest 

import (
	"net/http"

	"ecommerce/rest/handlers"
	"ecommerce/rest/middlewares"

)

func initRoutes(mux *http.ServeMux, manager *middleware.Manager) {	
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
	
	mux.Handle("GET /products/{id}", 
		manager.With(
			http.HandlerFunc(handlers.GetProduct),
	),
)

	mux.Handle("PUT /products/{id}", 
		manager.With(
			http.HandlerFunc(handlers.UpdateProduct),
	),
)
	
	mux.Handle("DELETE /products/{id}", 
		manager.With(
			http.HandlerFunc(handlers.DeleteProduct),
	),
)
	
}