#!/bin/bash

# Set environment variables for testing
export VERSION=1.0.0
export MODE=debug
export SERVICE_NAME=cortex
export HTTP_PORT=3345
export MIGRATION_SOURCE=file://migrations
export ENABLE_REDIS_TLS_MODE=false
export READ_REDIS_URL=redis://localhost:6379
export WRITE_REDIS_URL=redis://localhost:6379
export JWT_SECRET=test-secret-key-for-development-only
export RABBITMQ_URL=amqp://admin:admin@localhost:5672
export RMQ_RECONNECT_DELAY=5
export RMQ_RETRY_INTERVAL=600
export BGCE_DB_DSN=postgres://postgres:postgres@localhost:5432/bgce?sslmode=disable
export BGCE_DB_DRIVER=postgres

echo "Starting Cortex server with test configuration..."
echo "Server will be available at http://localhost:3345"
echo "API endpoints:"
echo "  GET  /api/v1/hello"
echo "  POST /api/v1/categories"
echo "  GET  /api/v1/categories"
echo "  POST /api/v1/sub-categories"
echo "  GET  /api/v1/sub-categories?parent_uuid=<uuid>"
echo "  GET  /api/v1/sub-categories/{id}"
echo "  PUT  /api/v1/sub-categories/{id}"
echo "  DELETE /api/v1/sub-categories/{id}"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the server
./cortex rest --port 3345
