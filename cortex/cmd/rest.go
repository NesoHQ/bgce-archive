package cmd

import (
	"log/slog"

	"github.com/spf13/cobra"

	"cortex/apm"
	"cortex/cache"
	category "cortex/category"
	"cortex/config"
	"cortex/logger"
	"cortex/rabbitmq"
	"cortex/repo"
	"cortex/rest"
	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
	"cortex/settings"
)

var serverRestCmd = &cobra.Command{
	Use:   "serve-rest",
	Short: "start a rest server",
	RunE:  serveRest,
}

func serveRest(cmd *cobra.Command, args []string) error {
	cnf := config.GetConfig()

	apm.InitAPM(*cnf.Apm)

	utils.InitValidator()

	logger.SetupLogger(cnf.ServiceName)

	rmq := rabbitmq.NewRMQ(cnf)
	defer rmq.Client.Stop()

	psql := repo.GetQueryBuilder()

	readBgceDB, err := repo.GetDbConnection(cnf.ReadBgceDB)
	if err != nil {
		slog.Error("Failed to connect to read bgce database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}
	defer repo.CloseDB(readBgceDB)

	writeBgceDB, err := repo.GetDbConnection(cnf.WriteBgceDB)
	if err != nil {
		slog.Error("Failed to connect to write bgce database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}
	defer repo.CloseDB(writeBgceDB)

	err = repo.MigrateDB(writeBgceDB, cnf.MigrationSource)
	if err != nil {
		slog.Error("Failed to migrate database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}

	readRedisClient, err := cache.NewRedisClient(cnf.ReadRedisURL, cnf.EnableRedisTLSMode)
	if err != nil {
		slog.Error("Unable to create redis read client", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}
	defer readRedisClient.Close()

	writeRedisClient, err := cache.NewRedisClient(cnf.WriteRedisURL, cnf.EnableRedisTLSMode)
	if err != nil {
		slog.Error("Unable to create redis write client", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}
	defer writeRedisClient.Close()

	redisCache := cache.NewCache(readRedisClient, writeRedisClient)
	slog.Info("Redis client is connected.")

	settings := settings.GetSettings(cnf)

	ctgryRepo := repo.NewCtgryRepo(readBgceDB, writeBgceDB, psql)

	ctgrySvc := category.NewService(cnf, rmq, ctgryRepo, redisCache)

	handlers := handlers.NewHandler(
		cnf,
		ctgrySvc,
	)

	middlewares := middlewares.NewMiddleware(cnf, redisCache, settings)

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
