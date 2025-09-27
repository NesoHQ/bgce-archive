package cmd  

import (

	"ecommerce/config"	
	"ecommerce/rest"
	"ecommerce/rest/handlers/product"
	"ecommerce/rest/handlers/user"
	"ecommerce/rest/middlewares"
	"ecommerce/repo"
)

func Serve(){
	cnf := config.GetConfig()

	productRepo := repo.NewProductRepo()
	userRepo := repo.NewUserRepo()

	middlewares := middleware.NewMiddlewares(cnf)

	productHandler :=  product.NewHandler(middlewares, productRepo)
	
	userHandler :=  user.NewHandler(cnf, userRepo)
	

	server := rest.NewServer(
		cnf,
		productHandler,
		userHandler, 
	)
	server.Start()
}