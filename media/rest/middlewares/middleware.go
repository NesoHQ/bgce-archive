package middlewares

import (
	"media/config"
)

type Middlewares struct {
	Cnf *config.Config
}

func NewMiddleware(
	cnf *config.Config,
) *Middlewares {
	return &Middlewares{
		Cnf: cnf,
	}
}
