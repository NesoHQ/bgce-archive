package middlewares

import "net/http"

type Middleware func(http.Handler) http.Handler

type Manager struct {
	globalMiddlewares []Middleware
}

func NewManager() *Manager {
	return &Manager{
		globalMiddlewares: make([]Middleware, 0),
	}
}

func (m *Manager) Use(middlewares ...Middleware) *Manager {
	m.globalMiddlewares = append(m.globalMiddlewares, middlewares...)
	return m
}

func (m *Manager) With(handler http.Handler, middlewares ...Middleware) http.Handler {
	var h http.Handler
	h = handler

	for _, m := range middlewares {
		h = m(h)
	}

	for _, m := range m.globalMiddlewares {
		h = m(h)
	}

	return h
}
