package middlewares

import (
	"cortex/config"
)

type Middlewares struct {
	Cnf            *config.Config
	cache          Cache
	cortexSettings CortexSettings
}

func NewMiddleware(
	cnf *config.Config,
	cache Cache,
	cortexSettings CortexSettings,
) *Middlewares {
	return &Middlewares{
		Cnf:            cnf,
		cache:          cache,
		cortexSettings: cortexSettings,
	}
}
