package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

func LoadConfig() *Config {
	// Load .env file if exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	rmqReconnectDelay, _ := strconv.Atoi(getEnv("RMQ_RECONNECT_DELAY", "5"))
	rmqRetryInterval, _ := strconv.Atoi(getEnv("RMQ_RETRY_INTERVAL", "600"))

	config := &Config{
		Version:     getEnv("VERSION", "1.0.0"),
		Mode:        getEnv("MODE", "debug"),
		ServiceName: getEnv("SERVICE_NAME", "community"),
		HTTPPort:    getEnv("HTTP_PORT", "8082"),

		JWTSecret: getEnv("JWT_SECRET", "your-secret-key"),

		APMServiceName: getEnv("APM_SERVICE_NAME", ""),
		APMServerURL:   getEnv("APM_SERVER_URL", ""),
		APMSecretToken: getEnv("APM_SECRET_TOKEN", ""),
		APMEnvironment: getEnv("APM_ENVIRONMENT", "development"),

		RabbitMQURL:       getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672"),
		RMQReconnectDelay: time.Duration(rmqReconnectDelay) * time.Second,
		RMQRetryInterval:  time.Duration(rmqRetryInterval) * time.Second,
		RMQQueuePrefix: getEnv("RMQ_QUEUE_PREFIX", "community-dev"),

		CommunityDBDSN:    getEnv("COMMUNITY_DB_DSN", "postgresql://postgres:root@localhost:5432/community_db?sslmode=disable"),
		CommunityDBDriver: getEnv("COMMUNITY_DB_DRIVER", "postgres"),
	}

	AppConfig = config
	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
