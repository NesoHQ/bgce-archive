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
	maxCSVUploadSizeMB, _ := strconv.ParseInt(getEnv("MAX_CSV_UPLOAD_SIZE_MB", "20"), 10, 64)

	config := &Config{
		Version:     getEnv("VERSION", "1.0.0"),
		Mode:        getEnv("MODE", "debug"),
		ServiceName: getEnv("SERVICE_NAME", "postal"),
		HTTPPort:    getEnv("HTTP_PORT", "8081"),

		JWTSecret: getEnv("JWT_SECRET", "your-secret-key"),

		MaxCSVUploadSizeMB: maxCSVUploadSizeMB,

		APMServiceName: getEnv("APM_SERVICE_NAME", ""),
		APMServerURL:   getEnv("APM_SERVER_URL", ""),
		APMSecretToken: getEnv("APM_SECRET_TOKEN", ""),
		APMEnvironment: getEnv("APM_ENVIRONMENT", "development"),

		RabbitMQURL:       getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672"),
		RMQReconnectDelay: time.Duration(rmqReconnectDelay) * time.Second,
		RMQRetryInterval:  time.Duration(rmqRetryInterval) * time.Second,
		RMQQueuePrefix:    getEnv("RMQ_QUEUE_PREFIX", "postal-dev"),

		ReadRedisURL:       getEnv("READ_REDIS_URL", "redis://localhost:6379"),
		WriteRedisURL:      getEnv("WRITE_REDIS_URL", "redis://localhost:6379"),
		EnableRedisTLSMode: getEnv("ENABLE_REDIS_TLS_MODE", "false") == "true",

		PostalDBDSN:    getEnv("POSTAL_DB_DSN", "postgresql://postgres:postgres@localhost:5432/postal_db?sslmode=disable"),
		PostalDBDriver: getEnv("POSTAL_DB_DRIVER", "postgres"),
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
