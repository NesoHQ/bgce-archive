package cmd

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"

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

	"github.com/golang-jwt/jwt"
	"github.com/spf13/cobra"
	"go.elastic.co/apm/module/apmhttp"
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

func GenerateJWTCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "gen-jwt",
		Short: "generate a jwt token",
		RunE: func(cmd *cobra.Command, args []string) error {
			conf := config.GetConfig()
			token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
				Id: "1",
			}).SignedString([]byte(conf.JwtSecret))
			if err != nil {
				return err
			}
			fmt.Printf("Generated JWT Token: %q\n", token)
			return nil
		},
	}
}

func APIServerCommand(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "serve-rest",
		Short: "start a rest server",
		RunE: func(cmd *cobra.Command, args []string) error {
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
			defer readBgceDB.Close()

			writeBgceDB, err := repo.GetDbConnection(cnf.WriteBgceDB)
			if err != nil {
				slog.Error("Failed to connect to write bgce database:", logger.Extra(map[string]any{
					"error": err.Error(),
				}))
				return err
			}
			defer writeBgceDB.Close()

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

			middlewares := middlewares.NewMiddleware(cnf, redisCache, middlewares.CortexConfig{
				UseRedisCache: true,
			})

			ctgryRepo := repo.NewCtgryRepo(readBgceDB, writeBgceDB, psql)
			ctgrySvc := category.NewService(cnf, rmq, ctgryRepo, redisCache)
			handlers := handlers.NewHandler(cnf, ctgrySvc)
			mux, err := rest.NewServeMux(middlewares, handlers)
			if err != nil {
				slog.Error("Failed to create the server:", logger.Extra(map[string]any{
					"error": err.Error(),
				}))
				return err
			}

			server := &http.Server{
				Addr:    fmt.Sprintf(":%d", cnf.HttpPort),
				Handler: apmhttp.Wrap(mux),
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
