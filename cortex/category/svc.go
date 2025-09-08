package category

import (
	"cortex/config"
	"cortex/ent"
	"cortex/rabbitmq"
)

type service struct {
	cnf   *config.Config
	rmq   *rabbitmq.RMQ
	cache Cache
	ent   *ent.Client
}

func NewService(
	cnf *config.Config,
	rmq *rabbitmq.RMQ,
	cache Cache,
	ent *ent.Client,
) Service {
	return &service{
		cnf:   cnf,
		rmq:   rmq,
		cache: cache,
		ent:   ent,
	}
}
