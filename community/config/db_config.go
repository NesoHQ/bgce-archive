package config

import (
	"fmt"
	"log"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// EnsureDatabaseExists checks if the database exists and creates it if not
func EnsureDatabaseExists(config *Config) error {
	dsn := config.CommunityDBDSN
	dbName := extractDatabaseName(dsn)

	if dbName == "" {
		return fmt.Errorf("could not extract database name from DSN")
	}

	defaultDSN := strings.Replace(dsn, "/"+dbName, "/postgres", 1)

	log.Printf("🔍 Checking if database '%s' exists...", dbName)

	db, err := gorm.Open(postgres.Open(defaultDSN), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to postgres database: %w", err)
	}

	var exists bool
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	err = db.Raw("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = ?)", dbName).Scan(&exists).Error
	if err != nil {
		return fmt.Errorf("failed to check database existence: %w", err)
	}

	if !exists {
		log.Printf("📦 Database '%s' does not exist, creating...", dbName)
		err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", dbName)).Error
		if err != nil {
			return fmt.Errorf("failed to create database: %w", err)
		}
		log.Printf("✅ Database '%s' created successfully", dbName)
	} else {
		log.Printf("✅ Database '%s' already exists", dbName)
	}

	return nil
}

func extractDatabaseName(dsn string) string {
	parts := strings.Split(dsn, "/")
	if len(parts) < 4 {
		return ""
	}

	dbPart := parts[3]
	if idx := strings.Index(dbPart, "?"); idx != -1 {
		dbPart = dbPart[:idx]
	}

	return dbPart
}

func InitDatabase(config *Config) (*gorm.DB, error) {
	var err error

	if err := EnsureDatabaseExists(config); err != nil {
		return nil, err
	}

	gormLogger := logger.Default
	if config.Mode == "release" {
		gormLogger = logger.Default.LogMode(logger.Silent)
	} else {
		gormLogger = logger.Default.LogMode(logger.Info)
	}

	DB, err = gorm.Open(postgres.Open(config.CommunityDBDSN), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	log.Println("✅ Database connected successfully")
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
