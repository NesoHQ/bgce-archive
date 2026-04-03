package cmd

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"axon/cache"
	"axon/config"
	"axon/email"
	"axon/notification"
	"axon/queue"
	"axon/repo"
)

func RunConsumer() error {
	// 1. Load config
	cfg := config.LoadConfig()

	// 2. Initialize database
	db, err := config.InitDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 3. Initialize Redis cache
	readClient, err := cache.NewRedisClient(cfg.ReadRedisURL, cfg.EnableRedisTLSMode, false)
	if err != nil {
		log.Fatalf("Failed to create read Redis client: %v", err)
	}
	writeClient, err := cache.NewRedisClient(cfg.WriteRedisURL, cfg.EnableRedisTLSMode, true)
	if err != nil {
		log.Fatalf("Failed to create write Redis client: %v", err)
	}
	cacheClient := cache.NewCache(readClient, writeClient)

	// 4. Initialize email provider
	emailProvider, err := email.NewProvider()
	if err != nil {
		log.Fatalf("Failed to create email provider: %v", err)
	}
	log.Printf("Using email provider: %s", emailProvider.GetName())

	// 5. Initialize repositories
	notificationRepo := repo.NewNotificationRepository(db)
	preferenceRepo := repo.NewPreferenceRepository(db)
	userRepo := repo.NewUserRepository(db)
	templateRepo := repo.NewTemplateRepository(db)

	// 6. Initialize notification service
	notificationService := notification.NewService(
		notificationRepo,
		preferenceRepo,
		userRepo,
		templateRepo,
		emailProvider,
		cacheClient,
	)

	// 7. Initialize RabbitMQ consumer
	consumer, err := queue.NewConsumer(cfg.RabbitMQURL, cfg.RabbitMQQueuePrefix+".notifications", notificationService, userRepo)
	if err != nil {
		log.Fatalf("Failed to create consumer: %v", err)
	}
	defer consumer.Close()

	// 8. Start consumer with context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := consumer.Start(ctx, cfg.RabbitMQQueueName); err != nil {
		log.Fatalf("Failed to start consumer: %v", err)
	}

	log.Println("Axon notification consumer started")

	// 9. Wait for shutdown signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down consumer...")
	cancel()
	time.Sleep(2 * time.Second) // Wait for in-flight messages

	return nil
}
