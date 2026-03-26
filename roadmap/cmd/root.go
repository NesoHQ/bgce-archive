package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "roadmap",
	Short: "Roadmap - Project management and tracking service",
	Long:  `A project management and tracking service for managing planned, in-progress, and completed tasks for various projects.`,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(restCmd)
}
