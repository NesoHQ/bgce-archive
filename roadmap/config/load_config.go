package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	config := &Config{
		Version:     getEnv("VERSION", "1.0.0"),
		Mode:        getEnv("MODE", DebugMode),
		ServiceName: getEnv("SERVICE_NAME", "my-service"),
		HTTPPort:    getEnv("HTTP_PORT", "8080"),

		JWTSecret: getEnv("JWT_SECRET", "defaultsecret"),

		MongoDBURI:   getEnv("MONGO_DB_URI", "mongodb://localhost:27017"),
		MonggoDBName: getEnv("MONGO_DB_NAME", ""),
	}

	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
