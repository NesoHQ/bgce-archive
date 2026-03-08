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
	Version           string `mapstructure:"VERSION"                           validate:"required"`
	Mode              Mode   `mapstructure:"MODE"                              validate:"required"`
	ServiceName       string `mapstructure:"SERVICE_NAME"                      validate:"required"`
	HttpPort          int    `mapstructure:"HTTP_PORT"                         validate:"required"`
	MigrationSource   string `mapstructure:"MIGRATION_SOURCE"                  validate:"required"`
	JwtSecret         string `mapstructure:"JWT_SECRET"                        validate:"required"`
	RabbitmqURL       string `mapstructure:"RABBITMQ_URL"                      validate:"required"`
	RmqReconnectDelay int    `mapstructure:"RMQ_RECONNECT_DELAY"               validate:"required"`
	RmqRetryInterval  int    `mapstructure:"RMQ_RETRY_INTERVAL"                validate:"required"`

	// Database Configuration (DSN format)
	BGCE_DB_DSN    string `mapstructure:"BGCE_DB_DSN"                       validate:"required"`
	BGCE_DB_DRIVER string `mapstructure:"BGCE_DB_DRIVER"                    validate:"required"`

	// MinIO/S3 Configuration
	MinIOEndpoint   string `mapstructure:"MINIO_ENDPOINT"                    validate:"required"`
	MinIOAccessKey  string `mapstructure:"MINIO_ACCESS_KEY"                  validate:"required"`
	MinIOSecretKey  string `mapstructure:"MINIO_SECRET_KEY"                  validate:"required"`
	MinIOUseSSL     bool   `mapstructure:"MINIO_USE_SSL"`
	MinIOBucketName string `mapstructure:"MINIO_BUCKET_NAME"                 validate:"required"`
	MinIORegion     string `mapstructure:"MINIO_REGION"                      validate:"required"`
	CDNBaseURL      string `mapstructure:"CDN_BASE_URL"`

	// Upload Configuration
	MaxUploadSizeMB      int    `mapstructure:"MAX_UPLOAD_SIZE_MB"            validate:"required"`
	AllowedImageTypes    string `mapstructure:"ALLOWED_IMAGE_TYPES"           validate:"required"`
	AllowedVideoTypes    string `mapstructure:"ALLOWED_VIDEO_TYPES"           validate:"required"`
	AllowedDocumentTypes string `mapstructure:"ALLOWED_DOCUMENT_TYPES"        validate:"required"`

	// Image Processing
	EnableImageOptimization bool `mapstructure:"ENABLE_IMAGE_OPTIMIZATION"`
	ThumbnailWidth          int  `mapstructure:"THUMBNAIL_WIDTH"`
	ThumbnailHeight         int  `mapstructure:"THUMBNAIL_HEIGHT"`
	MaxImageWidth           int  `mapstructure:"MAX_IMAGE_WIDTH"`
	MaxImageHeight          int  `mapstructure:"MAX_IMAGE_HEIGHT"`

	// APM (optional)
	Apm *Apm
}

var config *Config

func GetConfig() *Config {
	cnfOnce.Do(func() {
		loadConfig()
	})

	return config
}
