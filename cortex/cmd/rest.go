package cmd

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"path/filepath"

	"cortex/apm"
	"cortex/cache"
	category "cortex/category"
	"cortex/config"
	"cortex/ent"
	"cortex/logger"
	"cortex/rabbitmq"
	"cortex/repo"
	"cortex/rest"
	"cortex/rest/handlers"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
	"cortex/subcategory"
	"cortex/tenant"
	"cortex/user"

	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
	"github.com/ulule/limiter/v3"
	redisStore "github.com/ulule/limiter/v3/drivers/store/redis"
	"go.elastic.co/apm/module/apmhttp"
)

func APIServerCommand(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "serve-rest",
		Short: "start a rest server",
		RunE: func(cmd *cobra.Command, args []string) error {
			_ = context.Background()
			cnf := config.GetConfig()

			apm.InitAPM(*cnf.Apm)

			utils.InitValidator()

			logger.SetupLogger(cnf.ServiceName)

			// Ensure database exists before connecting
			if err := config.EnsureDatabaseExists(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN); err != nil {
				slog.Error("Failed to ensure database exists:", slog.Any("error", err))
				return err
			}

			// Run database migrations using golang-migrate
			slog.Info("Running database migrations...")
			sqlDB, err := sql.Open(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN)
			if err != nil {
				slog.Error("Failed to connect to database for migrations:", slog.Any("error", err))
				return err
			}

			migrationsPath := filepath.Join(".", "migrations")
			if err := repo.RunMigrations(repo.MigrationConfig{
				DB:             sqlDB,
				MigrationsPath: migrationsPath,
				DatabaseName:   "cortex",
			}); err != nil {
				slog.Error("Failed to run migrations:", slog.Any("error", err))
				sqlDB.Close()
				return err
			}
			sqlDB.Close()
			slog.Info("Database migrations completed successfully")

			rmq := rabbitmq.NewRMQ(cnf)
			defer rmq.Client.Stop()

			entClient, err := ent.Open(cnf.BGCE_DB_DRIVER, cnf.BGCE_DB_DSN)
			if err != nil {
				slog.Error("Failed to connect to bgce database:", slog.Any("error", err))
				return err
			}

			readRedisClient, err := cache.NewRedisClient(cnf.ReadRedisURL, cnf.EnableRedisTLSMode, false)
			if err != nil {
				slog.Error("Unable to create redis read client", logger.Extra(map[string]any{
					"error": err.Error(),
				}))
				return err
			}
			defer readRedisClient.Close()

			writeRedisClient, err := cache.NewRedisClient(cnf.WriteRedisURL, cnf.EnableRedisTLSMode, true)
			if err != nil {
				slog.Error("Unable to create redis write client", logger.Extra(map[string]any{
					"error": err.Error(),
				}))
				return err
			}
			defer writeRedisClient.Close()

			redisCache := cache.NewCache(readRedisClient, writeRedisClient)
			slog.Info("Redis client is connected.")

			// Initialize Rate Limiter Stores
			ipStore, err := redisStore.NewStoreWithOptions(writeRedisClient, limiter.StoreOptions{
				Prefix: "cortex:limiter:ip",
			})
			if err != nil {
				slog.Error("Failed to create IP limiter store", slog.Any("error", err))
				return err
			}

			userStore, err := redisStore.NewStoreWithOptions(writeRedisClient, limiter.StoreOptions{
				Prefix: "cortex:limiter:user",
			})
			if err != nil {
				slog.Error("Failed to create User limiter store", slog.Any("error", err))
				return err
			}

			authStore, err := redisStore.NewStoreWithOptions(writeRedisClient, limiter.StoreOptions{
				Prefix: "cortex:limiter:auth",
			})
			if err != nil {
				slog.Error("Failed to create Auth limiter store", slog.Any("error", err))
				return err
			}

			middlewares := middlewares.NewMiddleware(cnf, redisCache, middlewares.CortexConfig{
				UseRedisCache: true,
			}, ipStore, userStore, authStore)

			ctgrySvc := category.NewService(cnf, rmq, redisCache, entClient)
			subcategorySvc := subcategory.NewService(cnf, rmq, redisCache, entClient)

			// Initialize tenant service
			tenantRepo := tenant.NewRepository(entClient)
			tenantSvc := tenant.NewService(cnf, tenantRepo, entClient)

			userSvc := user.NewService(cnf, entClient)
			handlers := handlers.NewHandler(cnf, ctgrySvc, subcategorySvc, tenantSvc, userSvc, redisCache)

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
