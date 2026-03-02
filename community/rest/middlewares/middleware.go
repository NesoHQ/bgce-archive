package middlewares

import "github.com/ulule/limiter/v3"

type Middlewares struct {
	jwtSecret string
	IPStore   limiter.Store
}

func NewMiddlewares(jwtSecret string, ipStore limiter.Store) *Middlewares {
	return &Middlewares{
		jwtSecret: jwtSecret,
		IPStore:   ipStore,
	}
}
