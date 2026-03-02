package repo

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type MigrationConfig struct {
	DB                  *sql.DB
	MigrationsPath      string
	DatabaseName        string
	MigrationsTableName string
}

func RunMigrations(config MigrationConfig) error {
	migrationsTable := config.MigrationsTableName
	if migrationsTable == "" {
		migrationsTable = "schema_migrations"
	}

	log.Printf("🔍 Using migrations table: %s", migrationsTable)

	driver, err := postgres.WithInstance(config.DB, &postgres.Config{
		DatabaseName:    config.DatabaseName,
		MigrationsTable: migrationsTable,
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

	version, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		return fmt.Errorf("failed to get migration version: %w", err)
	}

	if dirty {
		log.Printf("⚠️  Database is in dirty state at version %d", version)
		log.Printf("🔧 Attempting to force migration to clean state...")

		if err := m.Force(int(version)); err != nil {
			log.Printf("❌ Failed to force clean state: %v", err)
			return fmt.Errorf("database is in dirty state at version %d and cannot be forced clean: %w", version, err)
		}

		log.Printf("✅ Forced migration to clean state at version %d", version)

		version, dirty, err = m.Version()
		if err != nil && err != migrate.ErrNilVersion {
			return fmt.Errorf("failed to get migration version after force: %w", err)
		}

		if dirty {
			return fmt.Errorf("database is still in dirty state at version %d after force", version)
		}
	}

	if err == migrate.ErrNilVersion {
		log.Println("📦 No migrations applied yet, starting fresh")
	} else {
		log.Printf("📊 Current migration version: %d", version)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	newVersion, _, _ := m.Version()
	if err == migrate.ErrNoChange {
		log.Printf("✅ No new migrations to apply (version: %d)", newVersion)
	} else {
		log.Printf("✅ Migrations completed successfully (version: %d)", newVersion)
	}

	return nil
}
