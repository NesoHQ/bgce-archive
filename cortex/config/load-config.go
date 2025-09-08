package config

import (
	"log/slog"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func loadConfig() error {
	exit := func(err error) {
		slog.Error(err.Error())
		os.Exit(1)
	}

	err := godotenv.Load()
	if err != nil {
		slog.Warn(".env not found, that's okay!")
	}

	viper.AutomaticEnv()

	config = &Config{
		Version:            viper.GetString("VERSION"),
		Mode:               Mode(viper.GetString("MODE")),
		ServiceName:        viper.GetString("SERVICE_NAME"),
		HttpPort:           viper.GetInt("HTTP_PORT"),
		MigrationSource:    viper.GetString("MIGRATION_SOURCE"),
		EnableRedisTLSMode: viper.GetBool("ENABLE_REDIS_TLS_MODE"),
		ReadRedisURL:       viper.GetString("READ_REDIS_URL"),
		WriteRedisURL:      viper.GetString("WRITE_REDIS_URL"),
		JwtSecret:          viper.GetString("JWT_SECRET"),
		Apm: &Apm{
			ServiceName: viper.GetString("APM_SERVICE_NAME"),
			ServerURL:   viper.GetString("APM_SERVER_URL"),
			SecretToken: viper.GetString("APM_SECRET_TOKEN"),
			Environment: viper.GetString("APM_ENVIRONMENT"),
		},
		RabbitmqURL:       viper.GetString("RABBITMQ_URL"),
		RmqReconnectDelay: viper.GetInt("RMQ_RECONNECT_DELAY"),
		RmqRetryInterval:  viper.GetInt("RMQ_RETRY_INTERVAL"),

		BGCE_DB_DSN:    viper.GetString("BGCE_DB_DSN"),
		BGCE_DB_DRIVER: viper.GetString("BGCE_DB_DRIVER"),
	}

	v := validator.New()
	if err = v.Struct(config); err != nil {
		exit(err)
	}

	return nil
}
