package settings

import "context"

func (stngs *settings) UseRedisCache(context.Context) (bool, error) {
	return true, nil
}
