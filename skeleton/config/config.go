package config

import (
	"sync"
)

var cnfOnce = sync.Once{}

type Mode string

const (
	DebugMode   = Mode("debug")
	ReleaseMode = Mode("release")
)

type Apm struct {
	ServiceName string `mapstructure:"APM_SERVICE_NAME"           validate:""`
	ServerURL   string `mapstructure:"APM_SERVER_URL"             validate:""`
	SecretToken string `mapstructure:"APM_SECRET_TOKEN"           validate:""`
	Environment string `mapstructure:"APM_ENVIRONMENT"            validate:""`
}

type Config struct {
	Version     string `mapstructure:"VERSION"                           validate:"required"`
	Mode        Mode   `mapstructure:"MODE"                              validate:"required"`
	ServiceName string `mapstructure:"SERVICE_NAME"                      validate:"required"`
	HttpPort    int    `mapstructure:"HTTP_PORT"                         validate:"required"`
	// MigrationSource   string `mapstructure:"MIGRATION_SOURCE"                  validate:"required"`
	// JwtSecret         string `mapstructure:"JWT_SECRET"               validate:"required"`
	// RabbitmqURL       string `mapstructure:"RABBITMQ_URL" validate:"required"`
	// RmqReconnectDelay int    `mapstructure:"RMQ_RECONNECT_DELAY" validate:"required"`
	// RmqRetryInterval  int    `mapstructure:"RMQ_RETRY_INTERVAL" validate:"required"`
	// ReadCortexDB   DBConfig
	// WriteCortexDB  DBConfig
	// Apm               *Apm
}

var config *Config

func GetConfig() *Config {
	cnfOnce.Do(func() {
		loadConfig()
	})

	return config
}
