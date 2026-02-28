# Build stage
FROM golang:1.24-alpine3.20 AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main main.go

# Run stage
FROM alpine:3.20

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy the compiled binary
COPY --from=builder /app/main .

# Copy migrations directory
COPY --from=builder /app/migrations ./migrations

# Expose port
EXPOSE 8080

# Command to run the executable
CMD ["/app/main", "serve-rest"]
