package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func GetDbConnection(dbURI string, dbName string) (*mongo.Database, error) {
	// This prevents the function from hanging indefinitely if the DB is down.
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Temporary debug check
	clientOptions := options.Client().ApplyURI(dbURI)
	log.Printf("Attempting to connect to hosts: %v\n", clientOptions.Hosts)
	if clientOptions.Auth != nil {
		log.Printf("Using Username: %s\n", clientOptions.Auth.Username)
	}

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize mongo client: %w", err)
	}

	// Ping the database to verify the connection is actually established
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, fmt.Errorf("could not connect to mongodb (ping failed): %w", err)
	}

	log.Println("Successfully connected to MongoDB")

	// 5. Return the specific database instance
	return client.Database(dbName), nil
}

func DisconnectDB(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := client.Disconnect(ctx)
	if err != nil {
		return fmt.Errorf("error disconnecting from MongoDB: %w", err)
	}

	log.Println("Successfully disconnected from MongoDB")
	return nil
}
