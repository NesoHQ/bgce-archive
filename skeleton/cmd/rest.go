package cmd

import (
	"log/slog"

	"github.com/spf13/cobra"

	category "servicetemplate/category"
	"servicetemplate/config"
	"servicetemplate/logger"
	"servicetemplate/rest"
	"servicetemplate/rest/handlers"
	"servicetemplate/rest/middlewares"
)

var serverRestCmd = &cobra.Command{
	Use:   "serve-rest",
	Short: "start a rest server",
	RunE:  serveRest,
}

func serveRest(cmd *cobra.Command, args []string) error {
	cnf := config.GetConfig()

	// apm.InitAPM(*cnf.Apm)

	// utils.InitValidator()

	// logger.SetupLogger(cnf.ServiceName)

	// rmq := rabbitmq.NewRMQ(cnf)
	// defer rmq.Client.Stop()
	// _ = repo.GetQueryBuilder() // this is the psql that will be passed down to repo

	// readDB, err := repo.GetDbConnection(cnf.ReadDB)
	// if err != nil {
	// 	slog.Error("Failed to connect to read example-service database:", logger.Extra(map[string]any{
	// 		"error": err.Error(),
	// 	}))
	// 	return err
	// }
	// defer repo.CloseDB(readDB)

	// writeDB, err := repo.GetDbConnection(cnf.WriteDB)
	// if err != nil {
	// 	slog.Error("Failed to connect to write example-service database:", logger.Extra(map[string]any{
	// 		"error": err.Error(),
	// 	}))
	// 	return err
	// }
	// defer repo.CloseDB(writeDB)

	// err = repo.MigrateDB(writeDB, cnf.MigrationSource)
	// if err != nil {
	// 	slog.Error("Failed to migrate database:", logger.Extra(map[string]any{
	// 		"error": err.Error(),
	// 	}))
	// 	return err
	// }

	exampleSvc := category.NewService(cnf)

	handlers := handlers.NewHandler(
		cnf,
		exampleSvc,
	)

	middlewares := middlewares.NewMiddleware(cnf)

	server, err := rest.NewServer(middlewares, cnf, handlers)
	if err != nil {
		slog.Error("Failed to create the server:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}

	server.Start()
	server.Wg.Wait()

	return nil
}
