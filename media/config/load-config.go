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
		Version:           viper.GetString("VERSION"),
		Mode:              Mode(viper.GetString("MODE")),
		ServiceName:       viper.GetString("SERVICE_NAME"),
		HttpPort:          viper.GetInt("HTTP_PORT"),
		MigrationSource:   viper.GetString("MIGRATION_SOURCE"),
		JwtSecret:         viper.GetString("JWT_SECRET"),
		RabbitmqURL:       viper.GetString("RABBITMQ_URL"),
		RmqReconnectDelay: viper.GetInt("RMQ_RECONNECT_DELAY"),
		RmqRetryInterval:  viper.GetInt("RMQ_RETRY_INTERVAL"),

		// Database Configuration (DSN format)
		BGCE_DB_DSN:    viper.GetString("BGCE_DB_DSN"),
		BGCE_DB_DRIVER: viper.GetString("BGCE_DB_DRIVER"),

		// MinIO Configuration
		MinIOEndpoint:   viper.GetString("MINIO_ENDPOINT"),
		MinIOAccessKey:  viper.GetString("MINIO_ACCESS_KEY"),
		MinIOSecretKey:  viper.GetString("MINIO_SECRET_KEY"),
		MinIOUseSSL:     viper.GetBool("MINIO_USE_SSL"),
		MinIOBucketName: viper.GetString("MINIO_BUCKET_NAME"),
		MinIORegion:     viper.GetString("MINIO_REGION"),
		CDNBaseURL:      viper.GetString("CDN_BASE_URL"),

		// Upload Configuration
		MaxUploadSizeMB:      viper.GetInt("MAX_UPLOAD_SIZE_MB"),
		AllowedImageTypes:    viper.GetString("ALLOWED_IMAGE_TYPES"),
		AllowedVideoTypes:    viper.GetString("ALLOWED_VIDEO_TYPES"),
		AllowedDocumentTypes: viper.GetString("ALLOWED_DOCUMENT_TYPES"),

		// Image Processing
		EnableImageOptimization: viper.GetBool("ENABLE_IMAGE_OPTIMIZATION"),
		ThumbnailWidth:          viper.GetInt("THUMBNAIL_WIDTH"),
		ThumbnailHeight:         viper.GetInt("THUMBNAIL_HEIGHT"),
		MaxImageWidth:           viper.GetInt("MAX_IMAGE_WIDTH"),
		MaxImageHeight:          viper.GetInt("MAX_IMAGE_HEIGHT"),

		// APM (optional)
		Apm: &Apm{
			ServiceName: viper.GetString("APM_SERVICE_NAME"),
			ServerURL:   viper.GetString("APM_SERVER_URL"),
			SecretToken: viper.GetString("APM_SECRET_TOKEN"),
			Environment: viper.GetString("APM_ENVIRONMENT"),
		},
	}

	v := validator.New()
	if err = v.Struct(config); err != nil {
		exit(err)
	}

	return nil
}
