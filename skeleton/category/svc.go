package category

import (
	"servicetemplate/config"
)

type service struct {
	cnf *config.Config
	// rmq *rabbitmq.RMQ
}

func NewService(
	cnf *config.Config,
	// rmq *rabbitmq.RMQ,
) Service {
	return &service{
		cnf: cnf,
		// rmq: rmq,
	}
}
