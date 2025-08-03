package rabbitmq

import (
	"servicetemplate/config"
)

type RMQ struct {
	Client Client
}

func NewRMQ(cnf *config.Config) *RMQ {
	// Init(ConnectionOptions{
	// 	URL:                        cnf.RabbitmqURL,
	// 	ReconnectInterval:          time.Duration(cnf.RmqReconnectDelay) * time.Second,
	// 	FailedMessageRetryInterval: time.Duration(cnf.RmqRetryInterval) * time.Second,
	// })

	// return &RMQ{
	// 	Client: GetClient(),
	// }
	return nil
}
