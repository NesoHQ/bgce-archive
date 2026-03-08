package handlers

import (
	"media/config"
	"media/media"
)

type Handlers struct {
	cnf      *config.Config
	mediaSvc media.Service
}

func NewHandler(
	cnf *config.Config,
	mediaSvc media.Service,
) *Handlers {
	return &Handlers{
		cnf:      cnf,
		mediaSvc: mediaSvc,
	}
}
