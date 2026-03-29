package config

import (
	"time"
)

const (
	DebugMode   = "debug"
	ReleaseMode = "release"
)

type Config struct {
	Version     string
	Mode        string
	ServiceName string
	HTTPPort    string

	JWTSecret string

	APMServiceName string
	APMServerURL   string
	APMSecretToken string
	APMEnvironment string

	RabbitMQURL       string
	RMQReconnectDelay time.Duration
	RMQRetryInterval  time.Duration
	RMQQueuePrefix string

	CommunityDBDSN    string
	CommunityDBDriver string
}

var AppConfig *Config

func GetConfig() *Config {
	if AppConfig == nil {
		AppConfig = LoadConfig()
	}
	return AppConfig
}
