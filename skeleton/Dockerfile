# Build stage
FROM golang:1.23.1-alpine3.20 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod tidy
COPY . .
RUN go build -o main main.go

# Run final stage
FROM alpine:3.14
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/migrations /app/migrations
EXPOSE 8080

# Command to run the executable
CMD ["/app/main", "serve-rest"]
