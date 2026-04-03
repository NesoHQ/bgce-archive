package cmd

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/spf13/cobra"

	"axon/cache"
	"axon/config"
	"axon/email"
	"axon/notification"
	"axon/queue"
	"axon/repo"
	"axon/rest"
	"axon/rest/handlers"
)

var rootCmd = &cobra.Command{
	Use:   "axon",
	Short: "Axon - Notification Service",
	Long:  `Axon is the notification microservice for BGCE Archive platform.`,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(restCmd)
	rootCmd.AddCommand(consumerCmd)
}

var restCmd = &cobra.Command{
	Use:   "rest",
	Short: "Start the Axon REST server",
	Run: func(cmd *cobra.Command, args []string) {
		if err := runRESTServer(); err != nil {
			fmt.Printf("Server error: %v\n", err)
			os.Exit(1)
		}
	},
}

var consumerCmd = &cobra.Command{
	Use:   "consumer",
	Short: "Start the Axon notification consumer",
	Run: func(cmd *cobra.Command, args []string) {
		if err := runConsumer(); err != nil {
			fmt.Printf("Consumer error: %v\n", err)
			os.Exit(1)
		}
	},
}

func runRESTServer() error {
	cfg := config.LoadConfig()
	cache.InitDNSCache()

	db, err := config.InitDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	readClient, _ := cache.NewRedisClient(cfg.ReadRedisURL, cfg.EnableRedisTLSMode, false)
	writeClient, _ := cache.NewRedisClient(cfg.WriteRedisURL, cfg.EnableRedisTLSMode, true)
	cacheClient := cache.NewCache(readClient, writeClient)

	emailProvider, err := email.NewProvider()
	if err != nil {
		log.Fatalf("Failed to create email provider: %v", err)
	}
	log.Printf("Using email provider: %s", emailProvider.GetName())

	if err := queue.SetupRabbitMQ(
		cfg.RabbitMQURL,
		cfg.RabbitMQExchangeName,
		cfg.RabbitMQExchangeType,
		cfg.RabbitMQQueueName,
	); err != nil {
		log.Printf("Warning: Failed to setup RabbitMQ: %v", err)
	}

	notificationRepo := repo.NewNotificationRepository(db)
	preferenceRepo := repo.NewPreferenceRepository(db)
	userRepo := repo.NewUserRepository(db)
	templateRepo := repo.NewTemplateRepository(db)

	notificationService := notification.NewService(
		notificationRepo,
		preferenceRepo,
		userRepo,
		templateRepo,
		emailProvider,
		cacheClient,
	)

	notificationHandler := handlers.NewNotificationHandler(notificationService)
	templateHandler := handlers.NewTemplateHandler(templateRepo)

	// Start consumer in background goroutine
	go func() {
		log.Println("Starting consumer in background...")
		consumer, err := queue.NewConsumer(cfg.RabbitMQURL, cfg.RabbitMQQueueName, notificationService, userRepo)
		if err != nil {
			log.Printf("Failed to create consumer: %v", err)
			return
		}
		defer consumer.Close()

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		if err := consumer.Start(ctx, cfg.RabbitMQQueueName); err != nil {
			log.Printf("Failed to start consumer: %v", err)
			return
		}

		log.Println("Consumer started successfully")

		// Keep consumer running
		<-ctx.Done()
	}()

	server := rest.NewServer(cfg.HTTPPort, notificationHandler, templateHandler)
	log.Printf("Starting Axon server on port %s", cfg.HTTPPort)

	return server.Start()
}

func runConsumer() error {
	cfg := config.LoadConfig()
	cache.InitDNSCache()

	db, err := config.InitDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	readClient, _ := cache.NewRedisClient(cfg.ReadRedisURL, cfg.EnableRedisTLSMode, false)
	writeClient, _ := cache.NewRedisClient(cfg.WriteRedisURL, cfg.EnableRedisTLSMode, true)
	cacheClient := cache.NewCache(readClient, writeClient)

	emailProvider, err := email.NewProvider()
	if err != nil {
		log.Fatalf("Failed to create email provider: %v", err)
	}
	log.Printf("Using email provider: %s", emailProvider.GetName())

	notificationRepo := repo.NewNotificationRepository(db)
	preferenceRepo := repo.NewPreferenceRepository(db)
	userRepo := repo.NewUserRepository(db)
	templateRepo := repo.NewTemplateRepository(db)

	notificationService := notification.NewService(
		notificationRepo,
		preferenceRepo,
		userRepo,
		templateRepo,
		emailProvider,
		cacheClient,
	)

	consumer, err := queue.NewConsumer(cfg.RabbitMQURL, cfg.RabbitMQQueueName, notificationService, userRepo)
	if err != nil {
		log.Fatalf("Failed to create consumer: %v", err)
	}
	defer consumer.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := consumer.Start(ctx, cfg.RabbitMQQueueName); err != nil {
		log.Fatalf("Failed to start consumer: %v", err)
	}

	log.Println("Axon notification consumer started")

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down consumer...")
	cancel()
	time.Sleep(2 * time.Second)

	return nil
}
