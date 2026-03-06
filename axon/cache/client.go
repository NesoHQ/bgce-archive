package cache

import (
	"crypto/tls"
	"fmt"
	"strings"
	"time"

	goRedis "github.com/redis/go-redis/v9"
)

// Tests

func NewRedisClient(redisURL string, enableRedisTLSMode bool, isWriteClient bool) (*goRedis.Client, error) {
	redisURL = strings.TrimSpace(redisURL)
	if redisURL == "" {
		return nil, nil
	}

	opt, err := goRedis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("invalid redis URL: %w", err)
	}

	if enableRedisTLSMode {
		opt.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
	}

	// Configure connection pool for high performance
	// Different settings for read vs write clients
	if isWriteClient {
		// Write client - moderate pool size
		opt.PoolSize = 20     // Max connections in pool
		opt.MinIdleConns = 5  // Keep 5 idle connections ready
		opt.MaxIdleConns = 10 // Max idle connections
	} else {
		// Read client - larger pool for high read throughput
		opt.PoolSize = 50     // Max connections in pool
		opt.MinIdleConns = 10 // Keep 10 idle connections ready
		opt.MaxIdleConns = 20 // Max idle connections
	}

	// Connection lifecycle settings
	opt.ConnMaxIdleTime = 5 * time.Minute  // Close idle connections after 5 minutes
	opt.ConnMaxLifetime = 30 * time.Minute // Recycle connections after 30 minutes

	// Timeout settings - aggressive for low latency
	opt.PoolTimeout = 4 * time.Second  // Wait time for connection from pool
	opt.DialTimeout = 2 * time.Second  // Connection establishment timeout
	opt.ReadTimeout = 2 * time.Second  // Socket read timeout
	opt.WriteTimeout = 2 * time.Second // Socket write timeout

	return goRedis.NewClient(opt), nil
}
