package cmd

import (
	"context"
	"log/slog"

	"cortex/config"
	"cortex/ent"
	"cortex/ent/migrate"
	"cortex/logger"
	"cortex/user"

	_ "github.com/lib/pq"

	"github.com/spf13/cobra"
)

func SeedCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "seed",
		Short: "Seed the database with initial data",
		Long:  "Seeds the database with default users and other initial data",
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := context.Background()
			cnf := config.GetConfig()

			logger.SetupLogger(cnf.ServiceName)

			// Connect to database
			entClient, err := ent.Open(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN)
			if err != nil {
				slog.Error("Failed to connect to database", slog.Any("error", err))
				return err
			}
			defer entClient.Close()

			// Run migrations
			slog.Info("Running database migrations...")
			if err := entClient.Schema.Create(
				ctx,
				migrate.WithDropIndex(true),
				migrate.WithDropColumn(true),
			); err != nil {
				slog.Error("Failed to run migrations", slog.Any("error", err))
				return err
			}

			// Seed users
			slog.Info("Seeding users...")
			if err := user.SeedDefaultUsers(ctx, entClient); err != nil {
				slog.Error("Failed to seed users", slog.Any("error", err))
				return err
			}

			// Print credentials
			user.PrintSeedCredentials()

			slog.Info("Database seeding completed successfully!")
			return nil
		},
	}
}
