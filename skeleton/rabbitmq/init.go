package rabbitmq

import (
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/wagslane/go-rabbitmq"
)

type ConnectionOptions struct {
	URL                        string
	ReconnectInterval          time.Duration
	FailedMessageRetryInterval time.Duration
}

var DefaultClient Client

// Init initializes rabbitmq client.
// On success, it sets the DefaultClient to established client.
// On failure, it exits the application instance.
func Init(opt ConnectionOptions) {
	conn, err := rabbitmq.NewConn(
		opt.URL,
		rabbitmq.WithConnectionOptionsLogger(&Logger{}),
		rabbitmq.WithConnectionOptionsReconnectInterval(opt.ReconnectInterval),
	)
	if err != nil {
		slog.Error(fmt.Sprintf("failed to connect to rabbitmq, error: %s", err.Error()))
		os.Exit(1)
	}

	DefaultClient = &client{
		serverUrl:              opt.URL,
		conn:                   conn,
		publishers:             map[string]*rabbitmq.Publisher{},
		consumers:              []*rabbitmq.Consumer{},
		failedMsgQueue:         []Message{},
		failedMsgRetryInterval: opt.FailedMessageRetryInterval,
		failedMsgStopChan:      make(chan bool),
	}
}

// GetClient returns DefaultClient.
// This should only be used after a successfull Init call.
func GetClient() Client {
	return DefaultClient
}
