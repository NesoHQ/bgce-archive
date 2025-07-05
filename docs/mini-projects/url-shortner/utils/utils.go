package utils

import (
	"math/rand"
	"time"
)

func GenerateKey(n int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seed := rand.New(rand.NewSource(time.Now().UnixNano()))
	key := make([]byte, n)
	for i := range key {
		key[i] = charset[seed.Intn(len(charset))]
	}
	return string(key)
}
