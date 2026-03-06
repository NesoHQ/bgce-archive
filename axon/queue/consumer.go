// @d:\Codes\bgce-archive\axon\queue\consumer.go
package queue

import (
    "context"
    "encoding/json"
    "log"
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

func (c *Consumer) Start(ctx context.Context) error {
    // Declare queue
    _, err := c.channel.QueueDeclare(
        c.queueName,
        true,  // durable
        false, // auto-delete
        false, // exclusive
        false, // no-wait
        nil,   // args
    )
    if err != nil {
        return err
    }

    // Bind to events
    events := []string{
        "user.registered",
        "password.reset.requested",
        "email.verification.requested",
        "comment.reply.created",
        "post.published",       // NEW
        "course.enrolled",      // NEW
    }

    for _, event := range events {
        if err := c.bindQueue(event); err != nil {
            return err
        }
    }

    // Consume messages
    msgs, err := c.channel.Consume(
        c.queueName,
        "",    // consumer
        false, // auto-ack (we'll ack manually)
        false, // exclusive
        false, // no-local
        false, // no-wait
        nil,   // args
    )
    if err != nil {
        return err
    }

    log.Printf("RabbitMQ consumer started, listening on queue: %s", c.queueName)

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

func (c *Consumer) handleMessage(ctx context.Context, msg amqp.Delivery) {
    var event Event
    if err := json.Unmarshal(msg.Body, &event); err != nil {
        log.Printf("Failed to parse event: %v", err)
        msg.Nack(false, false) // don't requeue invalid messages
        return
    }

    log.Printf("Received event: %s", event.Type)

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
    }

    if err != nil {
        log.Printf("Failed to handle event %s: %v", event.Type, err)
        // Requeue on failure (with delay)
        msg.Nack(false, true)
        return
    }

    msg.Ack(false)
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

    return c.service.SendCommentReplyNotification(ctx, postAuthorID, postAuthorEmail, commenterName, postTitle)
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