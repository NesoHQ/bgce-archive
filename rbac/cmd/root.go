package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	RootCmd = &cobra.Command{
		Use: "rbac",
		Short: "rbac server binary",
	}
)

func init() {
	RootCmd.AddCommand(serveRestCmd)
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println("Error Executing Custom Command: ", err)
		os.Exit(1)
	}
}