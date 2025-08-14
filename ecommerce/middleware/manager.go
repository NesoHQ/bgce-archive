package middleware

import (
	"net/http"
)


type Middleware func(http.Handler) http.Handler

type Manager struct {
	globalMiddlewares []Middleware
}


func NewManager() *Manager {
	return &Manager{
		globalMiddlewares: make([]Middleware, 0),
	}
}

func (mngr *Manager) Use(middlewares ...Middleware) *Manager {
	mngr.globalMiddlewares = append(mngr.globalMiddlewares, middlewares...)
	return mngr 
}

func (mngr *Manager) With(next http.Handler, middlewares ...Middleware) http.Handler {
	n := next

	for _, middleware := range middlewares {
		n = middleware(n)	
	}


	for _, globalMiddlewares := range mngr.globalMiddlewares {
		n = globalMiddlewares(n)	
	}

	return n 
}