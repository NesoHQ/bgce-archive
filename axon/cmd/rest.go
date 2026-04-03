package cmd

import (
	"log"

	"axon/cache"
	"axon/config"
	"axon/email"
	"axon/notification"
	"axon/queue"
	"axon/repo"
	"axon/rest"
	"axon/rest/handlers"
)

func RunRESTServer() error {
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

	// 5. Setup RabbitMQ exchange and queue
	if err := queue.SetupRabbitMQ(
		cfg.RabbitMQURL,
		cfg.RabbitMQExchangeName,
		cfg.RabbitMQExchangeType,
		cfg.RabbitMQQueueName,
	); err != nil {
		log.Printf("Warning: Failed to setup RabbitMQ: %v", err)
	}

	// 6. Initialize repositories
	notificationRepo := repo.NewNotificationRepository(db)
	preferenceRepo := repo.NewPreferenceRepository(db)
	userRepo := repo.NewUserRepository(db)
	templateRepo := repo.NewTemplateRepository(db)

	// 7. Initialize services
	notificationService := notification.NewService(
		notificationRepo,
		preferenceRepo,
		userRepo,
		templateRepo,
		emailProvider,
		cacheClient,
	)

	// 7. Initialize HTTP handlers
	notificationHandler := handlers.NewNotificationHandler(notificationService)
	templateHandler := handlers.NewTemplateHandler(templateRepo)

	// 8. Start server
	server := rest.NewServer(cfg.HTTPPort, notificationHandler, templateHandler)
	log.Printf("Starting Axon server on port %s", cfg.HTTPPort)

	return server.Start()
}
