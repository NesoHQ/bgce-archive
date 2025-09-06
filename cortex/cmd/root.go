package cmd

import (
	"context"
	"log/slog"
	"os"

	"github.com/spf13/cobra"
)

func Execute(ctx context.Context) {
	root := &cobra.Command{
		Use:   "cortex",
		Short: "cortex server binary",
	}
	root.AddCommand(APIServerCommand(ctx))
	root.AddCommand(GenerateJWTCommand())
	if err := root.ExecuteContext(ctx); err != nil {
		slog.Error("Failed to execute command", slog.Any("error", err))
		os.Exit(1)
	}
}
