package cmd

import (
	"database/sql"
	"log/slog"
	"path/filepath"
	"strings"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/spf13/cobra"

	"media/config"
	"media/logger"
	"media/media"
	"media/repo"
	"media/rest"
	"media/rest/handlers"
	"media/rest/middlewares"
)

var serverRestCmd = &cobra.Command{
	Use:   "serve-rest",
	Short: "start a rest server",
	RunE:  serveRest,
}

func serveRest(cmd *cobra.Command, args []string) error {
	cnf := config.GetConfig()

	logger.SetupLogger(cnf.ServiceName)

	// Run database migrations using golang-migrate
	slog.Info("Running database migrations...")
	sqlDB, err := sql.Open(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN)
	if err != nil {
		slog.Error("Failed to connect to database for migrations:", slog.Any("error", err))
		return err
	}

	migrationsPath := filepath.Join(".", "migrations")
	if err := repo.RunMigrations(repo.MigrationConfig{
		DB:                  sqlDB,
		MigrationsPath:      migrationsPath,
		DatabaseName:        "media",
		MigrationsTableName: "media_schema_migrations",
	}); err != nil {
		slog.Error("Failed to run migrations:", slog.Any("error", err))
		sqlDB.Close()
		return err
	}
	sqlDB.Close()
	slog.Info("Database migrations completed successfully")

	// Connect to database using sqlx
	db, err := sqlx.Connect(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN)
	if err != nil {
		slog.Error("Failed to connect to database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}
	defer db.Close()

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)

	slog.Info("Database connected successfully")

	// Initialize MinIO storage
	minioConfig := media.MinIOConfig{
		Endpoint:   cnf.MinIOEndpoint,
		AccessKey:  cnf.MinIOAccessKey,
		SecretKey:  cnf.MinIOSecretKey,
		UseSSL:     cnf.MinIOUseSSL,
		BucketName: cnf.MinIOBucketName,
		Region:     cnf.MinIORegion,
		CDNBaseURL: cnf.CDNBaseURL,
	}

	storage, err := media.NewMinIOStorage(minioConfig)
	if err != nil {
		slog.Error("Failed to initialize MinIO storage:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}

	slog.Info("MinIO storage initialized successfully", logger.Extra(map[string]any{
		"bucket": cnf.MinIOBucketName,
	}))

	// Initialize repository and service
	mediaRepo := media.NewRepository(db)

	// Parse allowed file types
	allowedImageTypes := strings.Split(cnf.AllowedImageTypes, ",")
	allowedVideoTypes := strings.Split(cnf.AllowedVideoTypes, ",")
	allowedDocumentTypes := strings.Split(cnf.AllowedDocumentTypes, ",")

	serviceConfig := media.ServiceConfig{
		MaxUploadSizeMB:      cnf.MaxUploadSizeMB,
		AllowedImageTypes:    allowedImageTypes,
		AllowedVideoTypes:    allowedVideoTypes,
		AllowedDocumentTypes: allowedDocumentTypes,
	}

	mediaSvc := media.NewService(mediaRepo, storage, serviceConfig)

	// Initialize handlers and server
	handlers := handlers.NewHandler(cnf, mediaSvc)
	middlewares := middlewares.NewMiddleware(cnf)

	server, err := rest.NewServer(middlewares, cnf, handlers)
	if err != nil {
		slog.Error("Failed to create the server:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}

	slog.Info("Media service started successfully", logger.Extra(map[string]any{
		"port":        cnf.HttpPort,
		"bucket":      cnf.MinIOBucketName,
		"max_size_mb": cnf.MaxUploadSizeMB,
	}))

	server.Start()
	server.Wg.Wait()

	return nil
}
