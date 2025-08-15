package category

import (
	"cortex/config"
	"cortex/rabbitmq"
)

type service struct {
	cnf       *config.Config
	rmq       *rabbitmq.RMQ
	ctgryRepo CtgryRepo
	cache     Cache
}

func NewService(
	cnf *config.Config,
	rmq *rabbitmq.RMQ,
	ctgryRepo CtgryRepo,
	cache Cache,
) Service {
	return &service{
		cnf:       cnf,
		rmq:       rmq,
		ctgryRepo: ctgryRepo,
	}
}
