package queue

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

// SetupRabbitMQ creates exchange and queue if they don't exist
func SetupRabbitMQ(amqpURL, exchangeName, exchangeType, queueName string) error {
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open channel: %w", err)
	}
	defer ch.Close()

	// Declare exchange
	err = ch.ExchangeDeclare(
		exchangeName,
		exchangeType,
		true,  // durable
		false, // auto-deleted
		false, // internal
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare exchange %s: %w", exchangeName, err)
	}
	log.Printf("Exchange '%s' declared", exchangeName)

	// Declare queue
	_, err = ch.QueueDeclare(
		queueName,
		true,  // durable
		false, // auto-delete
		false, // exclusive
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue %s: %w", queueName, err)
	}
	log.Printf("Queue '%s' declared", queueName)

	// Bind events
	events := []string{
		"user.registered",
		"password.reset.requested",
		"email.verification.requested",
		"comment.reply.created",
		"post.published",
		"course.enrolled",
	}

	for _, event := range events {
		err = ch.QueueBind(
			queueName,
			event,
			exchangeName,
			false,
			nil,
		)
		if err != nil {
			return fmt.Errorf("failed to bind event %s: %w", event, err)
		}
	}
	log.Printf("Bound %d events to queue", len(events))

	// Declare DLQ (Dead Letter Queue) for failed messages
	dlqName := queueName + ".dlq"
	_, err = ch.QueueDeclare(
		dlqName,
		true,  // durable
		false, // auto-delete
		false, // exclusive
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		return fmt.Errorf("failed to declare DLQ %s: %w", dlqName, err)
	}
	log.Printf("DLQ '%s' declared", dlqName)

	// Bind DLQ to exchange with dlq routing key
	err = ch.QueueBind(
		dlqName,
		"dlq.notifications",
		exchangeName,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to bind DLQ: %w", err)
	}
	log.Printf("DLQ bound to exchange with routing key 'dlq.notifications'")

	return nil
}
