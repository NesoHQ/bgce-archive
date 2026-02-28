package repo

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type MigrationConfig struct {
	DB             *sql.DB
	MigrationsPath string
	DatabaseName   string
}

// RunMigrations executes all pending migrations
func RunMigrations(config MigrationConfig) error {
	driver, err := postgres.WithInstance(config.DB, &postgres.Config{
		DatabaseName: config.DatabaseName,
	})
	if err != nil {
		return fmt.Errorf("failed to create migration driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", config.MigrationsPath),
		config.DatabaseName,
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migration instance: %w", err)
	}

	// Get current version
	version, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		return fmt.Errorf("failed to get migration version: %w", err)
	}

	if dirty {
		slog.Error("Database is in dirty state", "version", version)
		return fmt.Errorf("database is in dirty state at version %d", version)
	}

	if err == migrate.ErrNilVersion {
		slog.Info("No migrations applied yet, starting fresh")
	} else {
		slog.Info("Current migration version", "version", version)
	}

	// Run migrations
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	newVersion, _, _ := m.Version()
	if err == migrate.ErrNoChange {
		slog.Info("No new migrations to apply", "version", newVersion)
	} else {
		slog.Info("Migrations completed successfully", "new_version", newVersion)
	}

	return nil
}

// RollbackMigration rolls back the last migration
func RollbackMigration(config MigrationConfig) error {
	driver, err := postgres.WithInstance(config.DB, &postgres.Config{
		DatabaseName: config.DatabaseName,
	})
	if err != nil {
		return fmt.Errorf("failed to create migration driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", config.MigrationsPath),
		config.DatabaseName,
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migration instance: %w", err)
	}

	if err := m.Steps(-1); err != nil {
		return fmt.Errorf("failed to rollback migration: %w", err)
	}

	slog.Info("Migration rolled back successfully")
	return nil
}

// MigrateToVersion migrates to a specific version
func MigrateToVersion(config MigrationConfig, version uint) error {
	driver, err := postgres.WithInstance(config.DB, &postgres.Config{
		DatabaseName: config.DatabaseName,
	})
	if err != nil {
		return fmt.Errorf("failed to create migration driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", config.MigrationsPath),
		config.DatabaseName,
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migration instance: %w", err)
	}

	if err := m.Migrate(version); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to migrate to version %d: %w", version, err)
	}

	slog.Info("Migrated to version", "version", version)
	return nil
}

// GetMigrationVersion returns the current migration version
func GetMigrationVersion(config MigrationConfig) (uint, bool, error) {
	driver, err := postgres.WithInstance(config.DB, &postgres.Config{
		DatabaseName: config.DatabaseName,
	})
	if err != nil {
		return 0, false, fmt.Errorf("failed to create migration driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", config.MigrationsPath),
		config.DatabaseName,
		driver,
	)
	if err != nil {
		return 0, false, fmt.Errorf("failed to create migration instance: %w", err)
	}

	version, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		return 0, false, fmt.Errorf("failed to get migration version: %w", err)
	}

	if err == migrate.ErrNilVersion {
		return 0, false, nil
	}

	return version, dirty, nil
}
