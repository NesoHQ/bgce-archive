package cache

import (
	"crypto/tls"
	"fmt"
	"strings"

	goRedis "github.com/redis/go-redis/v9"
)

// Tests

func NewRedisClient(redisURL string, enableRedisTLSMode bool) (*goRedis.Client, error) {
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

	return goRedis.NewClient(opt), nil
}
