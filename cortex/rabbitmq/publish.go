package rabbitmq

import (
	"context"
	"log/slog"

	"github.com/wagslane/go-rabbitmq"
	"go.elastic.co/apm"
)

type PublishParams struct {
	ExchangeName string
	RoutingKey   string
	Msg          any
	Headers      rabbitmq.Table
}

func (rmq *RMQ) Publish(params PublishParams) {
	rmq.PublishWithContext(context.Background(), params)
}

func (rmq *RMQ) PublishWithContext(ctx context.Context, params PublishParams) {
	span, _ := apm.StartSpan(ctx, "PublishWithContext", "rabbitmq")
	defer span.End()
	slog.InfoContext(ctx, "Publishing message", slog.Any("message", params.Msg))
	rmq.Client.Publish(NewMessage(
		params.ExchangeName,
		params.RoutingKey,
		params.Msg,
		params.Headers,
	))
}
