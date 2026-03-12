// Consumer now uses exchange and queue names from config
// Exchange and queue are auto-created on startup
package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"axon/notification"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Consumer struct {
	conn      *amqp.Connection
	channel   *amqp.Channel
	service   notification.Service
	queueName string
}

type Event struct {
	Type    string                 `json:"type"`
	Payload map[string]interface{} `json:"payload"`
}

func NewConsumer(amqpURL, queueName string, service notification.Service) (*Consumer, error) {
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return nil, err
	}

	channel, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, err
	}

	return &Consumer{
		conn:      conn,
		channel:   channel,
		service:   service,
		queueName: queueName,
	}, nil
}

func (c *Consumer) Start(ctx context.Context, queueName string) error {
	if queueName == "" {
		queueName = c.queueName
	}

	// Consume messages from existing queue
	msgs, err := c.channel.Consume(
		queueName,
		"",    // consumer tag
		false, // auto-ack (manual ack)
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		return fmt.Errorf("failed to consume from queue %s: %w", queueName, err)
	}

	log.Printf("RabbitMQ consumer started, listening on queue: %s", queueName)

	go c.processMessages(ctx, msgs)
	return nil
}

func (c *Consumer) bindQueue(routingKey string) error {
	return c.channel.QueueBind(
		c.queueName,
		routingKey,
		"bgce.events", // exchange name
		false,
		nil,
	)
}

func (c *Consumer) processMessages(ctx context.Context, msgs <-chan amqp.Delivery) {
	for {
		select {
		case <-ctx.Done():
			log.Println("Consumer shutting down...")
			return
		case msg, ok := <-msgs:
			if !ok {
				return
			}
			c.handleMessage(ctx, msg)
		}
	}
}

const (
	maxRetries    = 3
	retryHeader   = "x-retry-count"
	dlqRoutingKey = "dlq.notifications"
)

func (c *Consumer) handleMessage(ctx context.Context, msg amqp.Delivery) {
	var event Event
	if err := json.Unmarshal(msg.Body, &event); err != nil {
		log.Printf("Failed to parse event: %v", err)
		msg.Nack(false, false) // don't requeue invalid messages
		return
	}

	log.Printf("Received event: %s", event.Type)

	// Get retry count from headers
	retryCount := 0
	if msg.Headers != nil {
		if val, ok := msg.Headers[retryHeader]; ok {
			switch v := val.(type) {
			case int:
				retryCount = v
			case int32:
				retryCount = int(v)
			case int64:
				retryCount = int(v)
			case float64:
				retryCount = int(v)
			}
		}
	}

	var err error
	switch event.Type {
	case "user.registered":
		err = c.handleUserRegistered(ctx, event.Payload)
	case "password.reset.requested":
		err = c.handlePasswordReset(ctx, event.Payload)
	case "email.verification.requested":
		err = c.handleEmailVerification(ctx, event.Payload)
	case "comment.reply.created":
		err = c.handleCommentReply(ctx, event.Payload)
	case "post.published":
		err = c.handlePostPublished(ctx, event.Payload)
	case "course.enrolled":
		err = c.handleCourseEnrolled(ctx, event.Payload)
	default:
		log.Printf("Unknown event type: %s", event.Type)
		msg.Nack(false, false) // reject unknown events
		return
	}

	if err != nil {
		retryCount++
		log.Printf("Failed to handle event %s (attempt %d/%d): %v", event.Type, retryCount, maxRetries, err)

		if retryCount >= maxRetries {
			// Send to DLQ
			log.Printf("Max retries reached for event %s, sending to DLQ", event.Type)
			c.sendToDLQ(msg, event, retryCount, err)
			msg.Ack(false) // Ack original message after sending to DLQ
			return
		}

		// Requeue with retry count incremented
		c.requeueWithRetry(msg, retryCount)
		return
	}

	msg.Ack(false)
}

func (c *Consumer) requeueWithRetry(msg amqp.Delivery, retryCount int) {
	headers := amqp.Table{}
	if msg.Headers != nil {
		for k, v := range msg.Headers {
			headers[k] = v
		}
	}
	headers[retryHeader] = retryCount

	err := c.channel.Publish(
		"",             // exchange (default)
		msg.RoutingKey, // routing key (same queue)
		false,          // mandatory
		false,          // immediate
		amqp.Publishing{
			ContentType: msg.ContentType,
			Body:        msg.Body,
			Headers:     headers,
		},
	)
	if err != nil {
		log.Printf("Failed to requeue message: %v", err)
		msg.Nack(false, true) // requeue original if republish fails
		return
	}

	msg.Ack(false) // ack original message after republishing
}

func (c *Consumer) sendToDLQ(msg amqp.Delivery, event Event, retryCount int, processingErr error) {
	dlqMsg := map[string]interface{}{
		"original_event": event,
		"retry_count":    retryCount,
		"error":          processingErr.Error(),
		"timestamp":      time.Now().Unix(),
		"routing_key":    msg.RoutingKey,
	}

	body, _ := json.Marshal(dlqMsg)

	err := c.channel.Publish(
		"bgce.events", // exchange
		dlqRoutingKey, // routing key for DLQ
		false,         // mandatory
		false,         // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
			Headers: amqp.Table{
				"x-original-routing-key": msg.RoutingKey,
				"x-retry-count":          retryCount,
				"x-error":                processingErr.Error(),
			},
		},
	)
	if err != nil {
		log.Printf("Failed to send message to DLQ: %v", err)
	}
}

func (c *Consumer) handleUserRegistered(ctx context.Context, payload map[string]interface{}) error {
	userID := uint(payload["user_id"].(float64))
	userEmail := payload["email"].(string)
	userName := payload["name"].(string)

	return c.service.SendWelcomeEmail(ctx, userID, userEmail, userName)
}

func (c *Consumer) handlePasswordReset(ctx context.Context, payload map[string]interface{}) error {
	userEmail := payload["email"].(string)
	resetToken := payload["token"].(string)

	return c.service.SendPasswordReset(ctx, userEmail, resetToken)
}

func (c *Consumer) handleEmailVerification(ctx context.Context, payload map[string]interface{}) error {
	userID := uint(payload["user_id"].(float64))
	userEmail := payload["email"].(string)
	verifyToken := payload["token"].(string)

	return c.service.SendEmailVerification(ctx, userID, userEmail, verifyToken)
}

func (c *Consumer) handleCommentReply(ctx context.Context, payload map[string]interface{}) error {
	postAuthorID := uint(payload["post_author_id"].(float64))
	postAuthorEmail := payload["post_author_email"].(string)
	commenterName := payload["commenter_name"].(string)
	postTitle := payload["post_title"].(string)
	comment := ""
	if commentVal, ok := payload["comment"]; ok {
		comment = commentVal.(string)
	}

	return c.service.SendCommentReplyNotification(ctx, postAuthorID, postAuthorEmail, commenterName, postTitle, comment)
}

// handlePostPublished notifies followers when a post is published (NEW)
func (c *Consumer) handlePostPublished(ctx context.Context, payload map[string]interface{}) error {
	// Payload contains array of followers to notify
	followers, ok := payload["followers"].([]interface{})
	if !ok {
		return nil
	}

	authorName := payload["author_name"].(string)
	postTitle := payload["post_title"].(string)
	postSlug := payload["post_slug"].(string)

	for _, f := range followers {
		follower := f.(map[string]interface{})
		followerID := uint(follower["id"].(float64))
		followerEmail := follower["email"].(string)

		if err := c.service.SendPostPublishedNotification(ctx, followerID, followerEmail, authorName, postTitle, postSlug); err != nil {
			log.Printf("Failed to notify follower %d: %v", followerID, err)
			// Continue with other followers
		}
	}

	return nil
}

// handleCourseEnrolled sends confirmation when user enrolls in course (NEW)
func (c *Consumer) handleCourseEnrolled(ctx context.Context, payload map[string]interface{}) error {
	userID := uint(payload["user_id"].(float64))
	userEmail := payload["email"].(string)
	courseName := payload["course_name"].(string)

	return c.service.SendCourseEnrolledNotification(ctx, userID, userEmail, courseName)
}

func (c *Consumer) Close() error {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		c.conn.Close()
	}
	return nil
}
