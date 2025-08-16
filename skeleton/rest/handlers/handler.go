package handlers

import (
	"servicetemplate/config"
)

type Handlers struct {
	cnf *config.Config
	// ccCordSvc template.Service
}

func NewHandler(
	cnf *config.Config,
	// ccCordSvc template.Service,
) *Handlers {
	return &Handlers{
		cnf: cnf,
		// ccCordSvc: ccCordSvc,
	}
}
