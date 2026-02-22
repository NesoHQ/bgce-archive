package tenant

import (
	"cortex/config"
	"cortex/ent"
)

type service struct {
	cnf  *config.Config
	repo Repository
	ent  *ent.Client
}

func NewService(
	cnf *config.Config,
	repo Repository,
	ent *ent.Client,
) Service {
	return &service{
		cnf:  cnf,
		repo: repo,
		ent:  ent,
	}
}
