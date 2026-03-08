package cmd

import (
	"fmt"
	"media/config"
	"os"

	"github.com/spf13/cobra"
)

var RootCmd = &cobra.Command{
	Use:   "media",
	Short: "Media Service - File upload and management service for BGCE Archive",
	Long: `Media Service handles file uploads, storage, and management for the BGCE Archive platform.
	
Features:
- File upload (images, videos, documents)
- Image optimization and resizing
- MinIO/S3 storage integration
- CDN support
- Multi-tenancy support`,
}

func init() {
	cobra.OnInitialize(initConfig)
	RootCmd.AddCommand(serverRestCmd)
	RootCmd.AddCommand(genJWTCmd)
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func initConfig() {
	config.GetConfig()
}
