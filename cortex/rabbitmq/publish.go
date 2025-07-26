package rabbitmq

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/wagslane/go-rabbitmq"
	"go.elastic.co/apm"

	"cortex/logger"
)

type PublishParams struct {
	ExchangeName string
	RoutingKey   string
	Msg          any
	Headers      rabbitmq.Table
}

func (rmq *RMQ) Publish(params PublishParams) {
	slog.Info(fmt.Sprintf("Publishing message: %s", logger.ConvertToJson(params.Msg)))
	rmq.Client.Publish(NewMessage(
		params.ExchangeName,
		params.RoutingKey,
		params.Msg,
		params.Headers,
	))
}

func (rmq *RMQ) PublishWithContext(ctx context.Context, params PublishParams) {
	span, _ := apm.StartSpan(ctx, "PublishWithContext", "rabbitmq")
	defer span.End()

	slog.InfoContext(ctx, fmt.Sprintf("Publishing message: %s", logger.ConvertToJson(params.Msg)))
	rmq.Client.Publish(NewMessage(
		params.ExchangeName,
		params.RoutingKey,
		params.Msg,
		params.Headers,
	))
}
