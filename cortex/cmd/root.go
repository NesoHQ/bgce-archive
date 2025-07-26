package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var RootCmd = &cobra.Command{
	Use:   "cortex",
	Short: "cortex server binary",
}

func init() {
	RootCmd.AddCommand(serverRestCmd)
	RootCmd.AddCommand(genJWTCmd)
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
