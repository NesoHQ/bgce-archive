# ── Stage 1: Build ────────────────────────────────────────────────
FROM golang:1.26-alpine AS builder

RUN apk add --no-cache ca-certificates git

WORKDIR /src

# Cache module downloads
COPY go.mod go.sum ./
RUN go mod download

# Copy source & build a static binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /bin/roadmap .

# ── Stage 2: Runtime ─────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /bin/roadmap /roadmap

# Default port exposed by the service
EXPOSE 8080

# Run as non-root (UID 65534 provided by distroless/nonroot)
USER nonroot:nonroot

ENTRYPOINT ["/roadmap", "rest"]
