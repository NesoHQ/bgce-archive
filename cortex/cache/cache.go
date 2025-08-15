package cache

import (
	goRedis "github.com/redis/go-redis/v9"

	"cortex/category"
	"cortex/rest/middlewares"
)

type Cache interface {
	middlewares.Cache
	category.Cache
}

type cache struct {
	readClient  goRedis.Cmdable
	writeClient goRedis.Cmdable
}

func NewCache(readClient goRedis.Cmdable, writeClient goRedis.Cmdable) Cache {
	return &cache{
		readClient:  readClient,
		writeClient: writeClient,
	}
}
