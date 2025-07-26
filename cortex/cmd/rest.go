package cmd

import (
	"log/slog"

	"github.com/spf13/cobra"

	category "cortex/category"
	"cortex/config"
	"cortex/logger"
	"cortex/rest"
	"cortex/rest/handlers"
	"cortex/rest/middlewares"
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

	// readCortexDB, err := repo.GetDbConnection(cnf.ReadCortexDB)
	// if err != nil {
	// 	slog.Error("Failed to connect to read cortex database:", logger.Extra(map[string]any{
	// 		"error": err.Error(),
	// 	}))
	// 	return err
	// }
	// defer repo.CloseDB(readCortexDB)

	// writeCortexDB, err := repo.GetDbConnection(cnf.WriteCortexDB)
	// if err != nil {
	// 	slog.Error("Failed to connect to write cortex database:", logger.Extra(map[string]any{
	// 		"error": err.Error(),
	// 	}))
	// 	return err
	// }
	// defer repo.CloseDB(writeCortexDB)

	// err = repo.MigrateDB(writeCortexDB, cnf.MigrationSource)
	// if err != nil {
	// 	slog.Error("Failed to migrate database:", logger.Extra(map[string]any{
	// 		"error": err.Error(),
	// 	}))
	// 	return err
	// }

	cortexSvc := category.NewService(cnf)

	handlers := handlers.NewHandler(
		cnf,
		cortexSvc,
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
