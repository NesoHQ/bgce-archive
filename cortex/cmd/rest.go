package cmd

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"net/http"

	"cortex/apm"
	"cortex/cache"
	category "cortex/category"
	"cortex/config"
	"cortex/ent"
	"cortex/ent/migrate"
	"cortex/logger"
	"cortex/rabbitmq"
	"cortex/rest"
	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
	"cortex/subcategory"
	"cortex/user"

	_ "github.com/lib/pq"

	"github.com/spf13/cobra"
	"go.elastic.co/apm/module/apmhttp"
)

func APIServerCommand(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "serve-rest",
		Short: "start a rest server",
		RunE: func(cmd *cobra.Command, args []string) error {
			backgroundContext := context.Background()
			cnf := config.GetConfig()

			apm.InitAPM(*cnf.Apm)

			utils.InitValidator()

			logger.SetupLogger(cnf.ServiceName)

			rmq := rabbitmq.NewRMQ(cnf)
			defer rmq.Client.Stop()

			entClient, err := ent.Open(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN)
			if err != nil {
				slog.Error("Failed to connect to bgce database:", slog.Any("error", err))
				return err
			}
			if err := entClient.Schema.Create(backgroundContext, migrate.WithDropIndex(true), migrate.WithDropColumn(true)); err != nil {
				slog.Error("Failed to create schema:", slog.Any("error", err))
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

			middlewares := middlewares.NewMiddleware(cnf, redisCache, middlewares.CortexConfig{
				UseRedisCache: true,
			})

			ctgrySvc := category.NewService(cnf, rmq, redisCache, entClient)
			subcategorySvc := subcategory.NewService(cnf, rmq, redisCache, entClient)
			userSvc := user.NewService(cnf, entClient)
			handlers := handlers.NewHandler(cnf, ctgrySvc, subcategorySvc, userSvc)

			// NewServeMux now returns http.Handler with all middlewares applied
			handler, err := rest.NewServeMux(middlewares, handlers)
			if err != nil {
				slog.Error("Failed to create the server:", logger.Extra(map[string]any{
					"error": err.Error(),
				}))
				return err
			}

			// Wrap with APM for monitoring
			handler = apmhttp.Wrap(handler)

			server := &http.Server{
				Addr:    fmt.Sprintf(":%d", cnf.HttpPort),
				Handler: handler,
				BaseContext: func(net.Listener) context.Context {
					return ctx
				},
				ConnContext: func(ctx context.Context, c net.Conn) context.Context {
					return ctx
				},
			}

			go func() {
				slog.Info("Starting REST server...", slog.String("address", server.Addr))
				if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
					slog.Error("Failed to start REST server", slog.Any("error", err))
					return
				}
			}()

			<-ctx.Done()
			slog.Info("Shutting down REST server...")
			if err := server.Shutdown(context.WithoutCancel(ctx)); err != nil {
				slog.Error("Failed to gracefully shutdown the REST server", slog.Any("error", err))
				return err
			}
			slog.Info("REST server stopped")
			return nil
		},
	}
}
