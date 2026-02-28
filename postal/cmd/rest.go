package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"postal/cache"
	"postal/config"
	"postal/post"
	"postal/repo"
	"postal/rest"
	"postal/rest/handlers"
	"postal/rest/middlewares"
	"postal/rest/utils"

	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

var restCmd = &cobra.Command{
	Use:   "rest",
	Short: "Start the REST API server",
	Long:  `Start the HTTP REST API server for the Postal service`,
	RunE:  runRESTServer,
}

func runRESTServer(cmd *cobra.Command, args []string) error {
	// Load configuration
	cfg := config.LoadConfig()
	log.Printf("🚀 Starting %s v%s in %s mode", cfg.ServiceName, cfg.Version, cfg.Mode)
	log.Printf("📊 Database: %s", cfg.PostalDBDSN)
	log.Printf("🔌 Port: %s", cfg.HTTPPort)

	// Initialize database
	log.Println("🔄 Connecting to database...")
	db, err := config.InitDatabase(cfg)
	if err != nil {
		log.Printf("❌ Database connection failed: %v", err)
		return fmt.Errorf("failed to initialize database: %w", err)
	}
	defer config.CloseDatabase()

	// Run migrations using golang-migrate
	log.Println("🔄 Running database migrations...")
	sqlDB, err := sql.Open("postgres", cfg.PostalDBDSN)
	if err != nil {
		log.Printf("❌ Failed to connect to database for migrations: %v", err)
		return fmt.Errorf("failed to connect to database for migrations: %w", err)
	}

	migrationsPath := filepath.Join(".", "migrations")
	if err := repo.RunMigrations(repo.MigrationConfig{
		DB:             sqlDB,
		MigrationsPath: migrationsPath,
		DatabaseName:   "postal",
	}); err != nil {
		log.Printf("❌ Migration failed: %v", err)
		sqlDB.Close()
		return fmt.Errorf("failed to run migrations: %w", err)
	}
	sqlDB.Close()
	log.Println("✅ Migrations completed successfully")

	// Initialize Validator
	validator := utils.NewValidator()

	// Initialize repositories
	log.Println("🔄 Initializing repositories...")
	postRepo := repo.NewPostRepository(db)
	versionRepo := repo.NewPostVersionRepository(db)

	// Initialize cache
	log.Println("🔄 Initializing cache...")
	var cacheClient cache.Cache
	writeRedisClient, err := cache.NewRedisClient(cfg.WriteRedisURL, cfg.EnableRedisTLSMode, true)
	if err != nil {
		log.Printf("⚠️ Failed to initialize Redis client, cache disabled: %v", err)
	} else if writeRedisClient != nil {
		// For postal, we use the same client for both read and write
		// In production, you might want separate read/write clients
		readRedisClient, err := cache.NewRedisClient(cfg.ReadRedisURL, cfg.EnableRedisTLSMode, false)
		if err != nil {
			log.Printf("⚠️ Failed to initialize Redis read client, using write client for both: %v", err)
			cacheClient = cache.NewCache(writeRedisClient, writeRedisClient)
		} else {
			cacheClient = cache.NewCache(readRedisClient, writeRedisClient)
			defer func() {
				if closeErr := readRedisClient.Close(); closeErr != nil {
					log.Printf("⚠️ Failed to close Redis read client: %v", closeErr)
				}
			}()
		}
		defer func() {
			if closeErr := writeRedisClient.Close(); closeErr != nil {
				log.Printf("⚠️ Failed to close Redis write client: %v", closeErr)
			}
		}()
		log.Println("✅ Redis cache initialized")
	}

	// Initialize services
	log.Println("🔄 Initializing services...")
	postService := post.NewService(postRepo, versionRepo, cacheClient)

	// Initialize handlers
	log.Println("🔄 Initializing handlers...")
	h := handlers.NewHandlers(postService, versionRepo, validator)

	// Initialize middlewares
	log.Println("🔄 Initializing middlewares...")
	// Explicitly set a cleanup interval for the in-memory store
	ipStore := memory.NewStoreWithOptions(limiter.StoreOptions{
		Prefix:          "postal:limiter",
		CleanUpInterval: time.Minute,
	})
	mw := middlewares.NewMiddlewares(cfg.JWTSecret, ipStore)

	// Create server
	log.Println("🔄 Creating HTTP server...")
	mux, err := rest.NewServeMux(mw, h)
	if err != nil {
		log.Printf("❌ Failed to create server: %v", err)
		return fmt.Errorf("failed to create server: %w", err)
	}

	// Start server
	addr := ":" + cfg.HTTPPort
	log.Printf("✅ Server ready!")
	log.Printf("🌐 Listening on http://localhost%s", addr)
	log.Printf("📝 Health check: http://localhost%s/api/v1/health", addr)
	log.Printf("📚 API Base: http://localhost%s/api/v1", addr)
	log.Println("Press Ctrl+C to stop")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Printf("❌ Server error: %v", err)
		return fmt.Errorf("server error: %w", err)
	}

	return nil
}
