package cache

import (
	"crypto/tls"
	"log/slog"

	goRedis "github.com/redis/go-redis/v9"

	"cortex/logger"
)

func redisOptions(redisUrl string, enableRedisTLSMode bool) (*goRedis.Options, error) {
	opt, err := goRedis.ParseURL(redisUrl)
	if err != nil {
		return nil, err
	}

	if enableRedisTLSMode {
		tlsConfig := &tls.Config{
			MinVersion: tls.VersionTLS12,
		}

		opt.TLSConfig = tlsConfig
	}

	return opt, nil
}

func NewRedisClient(redisUrl string, enableRedisTLSMode bool) (*goRedis.Client, error) {
	opt, err := redisOptions(redisUrl, enableRedisTLSMode)
	if err != nil {
		slog.Error("Unable to parse the redis URL", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return nil, err
	}

	client := goRedis.NewClient(opt)

	return client, nil
}
