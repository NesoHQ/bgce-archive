package config

import (
	"fmt"
	"log"
	"strings"

	"axon/repo"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// EnsureDataBaseExists checks if the database exists and creates it if not
func EnsureDataBaseExists(config *Config) error {
	// Parse DSN to extract database name
	dsn := config.AxonDBDSN
	dbName := extractDatabaseName(dsn)

	if dbName == "" {
		return fmt.Errorf("could not extract database name from DSN")
	}

	// connect to postgres database to check/create target database
	defaultDSN := strings.Replace(dsn, "/"+dbName, "/postgres", 1)

	log.Printf("Checking if database '%s' exists...", dbName)

	db, err := gorm.Open(postgres.Open(defaultDSN), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to postgres database: %w", err)
	}

	var exist bool
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	err = db.Raw("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = ?)", dbName).Scan(&exist).Error
	if err != nil {
		return fmt.Errorf("failed to check database existence %w", err)
	}

	if !exist {
		log.Printf("Database '%s' does not exist, creating...", dbName)
		err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", dbName)).Error
		if err != nil {
			return fmt.Errorf("failed to create database: %w", err)
		}

		log.Printf("Database '%s' created successfully", dbName)
	} else {
		log.Printf("Database '%s' already exists", dbName)
	}

	return nil
}

// extractDatabaseName extracts the database name from PostgreSQL DSN
func extractDatabaseName(dsn string) string {
	// DSN format: postgresql://user:pass@host:port/dbname?params
	parts := strings.Split(dsn, "/")

	if len(parts) < 4 {
		return ""
	}

	dbPart := parts[3]
	// Remove query parameters if present
	if idx := strings.Index(dbPart, "?"); idx != -1 {
		dbPart = dbPart[:idx]
	}

	return dbPart
}

func InitDatabase(config *Config) (*gorm.DB, error) {
	var err error

	// Ensure database exists
	if err := EnsureDataBaseExists(config); err != nil {
		return nil, err
	}

	// Configure GORM logger
	gormLogger := logger.Default
	if config.Mode == "release" {
		gormLogger = logger.Default.LogMode(logger.Silent)
	} else {
		gormLogger = logger.Default.LogMode(logger.Info)
	}

	// Connect to database
	DB, err = gorm.Open(postgres.Open(config.AxonDBDSN), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying SQL DB for connection pool settings
	sqlDB, err := DB.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	// set connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	log.Printf("Database connected successfully")

	// Run migrations
	if err := repo.RunMigrations(repo.MigrationConfig{
		DB:                  sqlDB,
		MigrationsPath:      "migrations",
		DatabaseName:        "axon",
		MigrationsTableName: "axon_schema_migrations",
	}); err != nil {
		log.Printf("Warning: Failed to run migrations: %v", err)
	}

	return DB, nil
}

func CloseDatabase() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}

		return sqlDB.Close()
	}

	return nil
}
