package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"rbac/rest"
)

var serveRestCmd = &cobra.Command{
	Use:   "serve-rest",
	Short: "serve a rest server",
	RunE:  serveRest,
}

func serveRest(cmd *cobra.Command, args []string) error {
	server, err := rest.NewServer()
	if err != nil {
		fmt.Println("Failed to create the server: ", err)

		return err
	}
	server.Start()
	server.Wg.Wait()

	return nil
}
