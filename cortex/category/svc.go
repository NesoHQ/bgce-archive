package category

import (
	"cortex/config"
	"cortex/rabbitmq"
)

type service struct {
	cnf       *config.Config
	rmq       *rabbitmq.RMQ
	ctgryRepo CtgryRepo
}

func NewService(
	cnf *config.Config,
	rmq *rabbitmq.RMQ,
	ctgryRepo CtgryRepo,
) Service {
	return &service{
		cnf:       cnf,
		rmq:       rmq,
		ctgryRepo: ctgryRepo,
	}
}
