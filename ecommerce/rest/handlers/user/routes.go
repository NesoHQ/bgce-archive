package user 

import (
	"net/http"

	"ecommerce/rest/middlewares"

)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {	
	mux.Handle(
		"POST /users", 
			manager.With(
				http.HandlerFunc(h.CreateUser),
		),
	)

	mux.Handle(
		"POST /users/login", 
			manager.With(
				http.HandlerFunc(h.Login),
		),
	)
	
}