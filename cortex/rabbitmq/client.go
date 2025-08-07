package rabbitmq

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/wagslane/go-rabbitmq"

	"cortex/logger"
	"cortex/util"
)

// Consumer defines consumer function signature
type Consumer func(context.Context, []byte) error

// ConsumerOption options to run a new consumer
type ConsumerOption struct {
	Exchange   string
	RoutingKey string
	Queue      string
	Consumer   Consumer

	PrefetchCount int

	Dlq           bool
	DlqRoutingKey string
	DlqName       string
}

// Message structure to publish a new message
type Message struct {
	Exchange   string
	RoutingKey string
	Message    []byte
	Headers    rabbitmq.Table
}

func toJson(data any) []byte {
	d, e := json.Marshal(data)
	if e != nil {
		return []byte(``)
	}
	return d
}

// NewMessage creates a new Message instance.
// This is an utility function to create a new message instance.
func NewMessage(exchange, routingKey string, data interface{}, headers rabbitmq.Table) Message {
	dataStr := toJson(data)
	return Message{
		Exchange:   exchange,
		RoutingKey: routingKey,
		Message:    []byte(dataStr),
		Headers:    headers,
	}
}

// Client interface for a rabbitmq pub/sub client
type Client interface {
	// Start runs retry routine.
	// This does not block execution.
	// This should be called only once.
	Start()

	// Stop stops retry routine and consumers.
	// This also cleans up publishers and finally stops
	// the connection.
	// This should be called only once. After calling Stop
	// a client should not be used anymore, create a new client if
	// you have to.
	Stop()

	// Conn returns underlying rabbitmq.Conn
	Conn() *rabbitmq.Conn

	// AddConsumer adds and starts consuming
	AddConsumer(ConsumerOption) error

	// Publish publishes message, on failure enqueues for retry
	Publish(Message)
}

type client struct {
	serverUrl string // rabbitmq server url

	conn *rabbitmq.Conn

	publishers  map[string]*rabbitmq.Publisher // [route]*rabbitmq.Publisher
	publisersMu sync.Mutex

	consumers   []*rabbitmq.Consumer
	consumersMu sync.Mutex

	failedMsgQueue []Message
	failedMsgMu    sync.Mutex

	failedMsgRetryInterval time.Duration

	failedMsgStopChan chan bool
}

func (c *client) createDlq(opt ConsumerOption) error {
	conn, err := amqp.Dial(c.serverUrl)
	if err != nil {
		return err
	}

	channel, err := conn.Channel()
	if err != nil {
		return err
	}

	defer conn.Close()

	// declare exchange
	if err := channel.ExchangeDeclare(
		opt.Exchange, // exchange
		"topic",      // kind
		true,         // durable
		false,        // autoDelete
		false,        // internal
		false,        // nowait
		nil,          // args
	); err != nil {
		return err
	}

	// declare queue
	if _, err := channel.QueueDeclare(
		opt.DlqName, // name
		true,        // durable
		false,       // autoDelete
		false,       // exclusive
		false,       // nowait
		nil,         // args
	); err != nil {
		return err
	}

	// bind queue
	if err := channel.QueueBind(
		opt.DlqName,       // name
		opt.DlqRoutingKey, // key
		opt.Exchange,      // exchange
		false,             // noWait
		nil,               // args
	); err != nil {
		return err
	}

	return nil
}

func contextWithTraceInfo(headers rabbitmq.Table) context.Context {
	traceID := ""
	if val, ok := headers[util.X_TRACE_ID_KEY]; ok {
		traceID, _ = val.(string)
	}

	if traceID == "" {
		newtraceID, err := uuid.NewRandom()
		if err != nil {
			slog.Error("Failed to generate uuid")
			return context.Background()
		}
		traceID = newtraceID.String()
	}

	spanID, err := uuid.NewRandom()
	if err != nil {
		slog.Error("Failed to generate uuid")
		return context.Background()
	}

	ctx := context.WithValue(context.Background(), logger.TraceIDKey, traceID)
	ctx = context.WithValue(ctx, logger.SpanIDKey, spanID.String())
	return ctx
}

func (c *client) runConsumer(opt ConsumerOption) (*rabbitmq.Consumer, error) {
	consumer, err := rabbitmq.NewConsumer(
		c.conn,
		opt.Queue,

		rabbitmq.WithConsumerOptionsLogger(&Logger{}),

		rabbitmq.WithConsumerOptionsRoutingKey(opt.RoutingKey),
		rabbitmq.WithConsumerOptionsQueueDurable,
		rabbitmq.WithConsumerOptionsConsumerAutoAck(false),

		rabbitmq.WithConsumerOptionsExchangeName(opt.Exchange),
		rabbitmq.WithConsumerOptionsExchangeKind("topic"),
		rabbitmq.WithConsumerOptionsExchangeDeclare,
		rabbitmq.WithConsumerOptionsExchangeDurable,

		rabbitmq.WithConsumerOptionsQOSPrefetch(opt.PrefetchCount),
	)
	if err != nil {
		return nil, err
	}

	go consumer.Run(func(d rabbitmq.Delivery) (action rabbitmq.Action) {
		err := opt.Consumer(contextWithTraceInfo(rabbitmq.Table(d.Headers)), d.Body)
		if err == nil {
			return rabbitmq.Ack
		}

		if opt.Dlq {
			c.Publish(NewMessage(opt.Exchange, opt.DlqRoutingKey, d.Body, nil))
		}

		return rabbitmq.Ack
	})

	return consumer, nil
}

// AddConsumer implements Client.
func (c *client) AddConsumer(opt ConsumerOption) error {
	if opt.Dlq && (opt.DlqName == "" || opt.DlqRoutingKey == "") {
		return fmt.Errorf(
			"dlq name and routing key is required. got, dlq: %s, dlq route: %s",
			opt.DlqName,
			opt.DlqRoutingKey,
		)
	}

	if opt.Dlq {
		if err := c.createDlq(opt); err != nil {
			return err
		}
	}

	c.runConsumer(opt)

	return nil
}

// Conn implements Client.
func (c *client) Conn() *rabbitmq.Conn {
	return c.conn
}

func (c *client) createPublisher(exchange string, route string) (*rabbitmq.Publisher, error) {
	publisher, err := rabbitmq.NewPublisher(
		c.conn,
		rabbitmq.WithPublisherOptionsLogger(&Logger{}),

		rabbitmq.WithPublisherOptionsExchangeName(exchange),
		rabbitmq.WithPublisherOptionsExchangeDeclare,
		rabbitmq.WithPublisherOptionsExchangeDurable,
		rabbitmq.WithPublisherOptionsExchangeKind("topic"),
	)
	if err != nil {
		return nil, err
	}

	c.setPublisher(route, publisher)

	slog.Info(fmt.Sprintf("created new publisher. exchange: %s, route: %s", exchange, route))

	return publisher, nil
}

func (c *client) setPublisher(route string, p *rabbitmq.Publisher) {
	c.publisersMu.Lock()
	defer c.publisersMu.Unlock()
	c.publishers[route] = p
}

func (c *client) getPublisher(route string) (*rabbitmq.Publisher, bool) {
	c.publisersMu.Lock()
	defer c.publisersMu.Unlock()
	publisher, ok := c.publishers[route]
	return publisher, ok
}

func (c *client) tryPublish(msg Message) error {
	// create/get publisher
	publisher, ok := c.getPublisher(msg.RoutingKey)
	if !ok {
		p, e := c.createPublisher(msg.Exchange, msg.RoutingKey)
		if e != nil {
			slog.Error(
				fmt.Sprintf(
					"failed to create publisher. exchange: %s, route: %s, error: %s",
					msg.Exchange,
					msg.RoutingKey,
					e.Error(),
				),
			)
			return e
		}
		publisher = p
	}

	// publish
	return publisher.Publish(
		msg.Message,
		[]string{msg.RoutingKey},
		rabbitmq.WithPublishOptionsPersistentDelivery,
		rabbitmq.WithPublishOptionsMandatory,
		rabbitmq.WithPublishOptionsExchange(msg.Exchange),
		rabbitmq.WithPublishOptionsHeaders(msg.Headers),
	)
}

// Publish implements Client.
func (c *client) Publish(msg Message) {
	// try to publish immediately
	err := c.tryPublish(msg)

	if err == nil {
		return
	}

	// enqueue to failed messages
	c.failedMsgMu.Lock()
	defer c.failedMsgMu.Unlock()
	c.failedMsgQueue = append(c.failedMsgQueue, msg)

	slog.Info(
		fmt.Sprintf(
			"enqueued failed message. count: %d, error: %s",
			len(c.failedMsgQueue),
			err.Error(),
		),
	)
}

func (c *client) startRetryLoop() {
	ticker := time.NewTicker(c.failedMsgRetryInterval)
	defer ticker.Stop()

ForLoop:
	for {
		select {
		case <-c.failedMsgStopChan:
			slog.Debug("stopping failed message retry loop")
			break ForLoop

		case <-ticker.C:
			c.failedMsgMu.Lock()

			if len(c.failedMsgQueue) == 0 {
				c.failedMsgMu.Unlock()
				break
			}

			failedAgain := []Message{}
			for _, msg := range c.failedMsgQueue {
				if err := c.tryPublish(msg); err != nil {
					failedAgain = append(failedAgain, msg)
				}
			}

			c.failedMsgQueue = failedAgain

			slog.Info(fmt.Sprintf("retried failed messages. failed again: %d", len(failedAgain)))

			c.failedMsgMu.Unlock()
		}
	}
}

func (c *client) stopRetryLoop() {
	c.failedMsgStopChan <- true
}

// Start implements Client.
func (c *client) Start() {
	go c.startRetryLoop()
}

// Stop implements Client.
func (c *client) Stop() {
	c.stopRetryLoop()

	c.consumersMu.Lock()
	defer c.consumersMu.Unlock()
	for _, consumer := range c.consumers {
		consumer.Close()
	}
	c.consumers = []*rabbitmq.Consumer{}

	c.publisersMu.Lock()
	defer c.publisersMu.Unlock()
	c.publishers = map[string]*rabbitmq.Publisher{}

	c.conn.Close()

	slog.Info("all cleaned up. client stopped.")
}

var _ = (Client)(&client{})
