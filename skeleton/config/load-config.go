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
		slog.Warn(".env not found,that's okay!")
	}

	viper.AutomaticEnv()

	config = &Config{
		Version:     viper.GetString("VERSION"),
		Mode:        Mode(viper.GetString("MODE")),
		ServiceName: viper.GetString("SERVICE_NAME"),
		HttpPort:    viper.GetInt("HTTP_PORT"),
		// MigrationSource: viper.GetString("MIGRATION_SOURCE"),
		// JwtSecret:       viper.GetString("JWT_SECRET"),
		// Apm: &Apm{
		// 	ServiceName: viper.GetString("APM_SERVICE_NAME"),
		// 	ServerURL:   viper.GetString("APM_SERVER_URL"),
		// 	SecretToken: viper.GetString("APM_SECRET_TOKEN"),
		// 	Environment: viper.GetString("APM_ENVIRONMENT"),
		// },
		// RabbitmqURL:       viper.GetString("RABBITMQ_URL"),
		// RmqReconnectDelay: viper.GetInt("RMQ_RECONNECT_DELAY"),
		// RmqRetryInterval:  viper.GetInt("RMQ_RETRY_INTERVAL"),
		// ReadDB: &ReadDB{
		// 	DbHost:                 viper.GetString("READ_DB_HOST"),
		// 	DbPort:                 viper.GetInt("READ_DB_PORT"),
		// 	DbName:                 viper.GetString("READ_DB_NAME"),
		// 	DbUser:                 viper.GetString("READ_DB_USER"),
		// 	DbPassword:             viper.GetString("READ_DB_PASSWORD"),
		// 	DbMaxIdleTimeInMinutes: viper.GetInt("READ_DB_MAX_IDLE_TIME_IN_MINUTES"),
		// 	DbMaxOpenConns:         viper.GetInt("READ_DB_MAX_OPEN_CONNS"),
		// 	DbMaxIdleConns:         viper.GetInt("READ_DB_MAX_IDLE_CONNS"),
		// 	DbEnableSSLMode:        viper.GetBool("READ_DB_ENABLE_SSL_MODE"),
		// },
		// WriteDB: &WriteDB{
		// 	DbHost:                 viper.GetString("WRITE_DB_HOST"),
		// 	DbPort:                 viper.GetInt("WRITE_DB_PORT"),
		// 	DbName:                 viper.GetString("WRITE_DB_NAME"),
		// 	DbUser:                 viper.GetString("WRITE_DB_USER"),
		// 	DbPassword:             viper.GetString("WRITE_DB_PASSWORD"),
		// 	DbMaxIdleTimeInMinutes: viper.GetInt("WRITE_DB_MAX_IDLE_TIME_IN_MINUTES"),
		// 	DbMaxOpenConns:         viper.GetInt("WRITE_DB_MAX_OPEN_CONNS"),
		// 	DbMaxIdleConns:         viper.GetInt("WRITE_DB_MAX_IDLE_CONNS"),
		// 	DbEnableSSLMode:        viper.GetBool("WRITE_DB_ENABLE_SSL_MODE"),
		// },
	}

	v := validator.New()
	if err = v.Struct(config); err != nil {
		exit(err)
	}

	return nil
}
