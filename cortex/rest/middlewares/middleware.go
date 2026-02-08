package middlewares

import (
	"cortex/config"
	"github.com/ulule/limiter/v3"
)

type Middlewares struct {
	Cnf            *config.Config
	cache          Cache
	cortexSettings CortexConfig
	IPStore        limiter.Store
	UserStore      limiter.Store
	AuthStore      limiter.Store
}

func NewMiddleware(cnf *config.Config, cache Cache, cortexSettings CortexConfig, ipStore, userStore, authStore limiter.Store) *Middlewares {
	return &Middlewares{
		Cnf:            cnf,
		cache:          cache,
		cortexSettings: cortexSettings,
		IPStore:        ipStore,
		UserStore:      userStore,
		AuthStore:      authStore,
	}
}
