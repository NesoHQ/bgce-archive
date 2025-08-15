package settings

import "context"

type Settings interface {
	UseRedisCache(context.Context) (bool, error)
}
