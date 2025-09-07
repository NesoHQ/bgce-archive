package category

import (
	"cortex/config"
	"cortex/ent"
	"cortex/rabbitmq"
)

type service struct {
	cnf       *config.Config
	rmq       *rabbitmq.RMQ
	ctgryRepo CtgryRepo
	cache     Cache
	ent       *ent.Client
}

func NewService(
	cnf *config.Config,
	rmq *rabbitmq.RMQ,
	ctgryRepo CtgryRepo,
	cache Cache,
	ent *ent.Client,
) Service {
	return &service{
		cnf:       cnf,
		rmq:       rmq,
		ctgryRepo: ctgryRepo,
		cache:     cache,
		ent:       ent,
	}
}
