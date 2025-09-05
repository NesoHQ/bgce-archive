package middlewares

import (
	"cortex/config"
)

type Middlewares struct {
	Cnf            *config.Config
	cache          Cache
	cortexSettings CortexConfig
}

func NewMiddleware(cnf *config.Config, cache Cache, cortexSettings CortexConfig) *Middlewares {
	return &Middlewares{
		Cnf:            cnf,
		cache:          cache,
		cortexSettings: cortexSettings,
	}
}
