package cmd

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"postal/cache"
	"postal/config"
	"postal/post"
	"postal/post_version"
	"postal/repo"
	"postal/rest"
	"postal/rest/handlers"
	"postal/rest/middlewares"
	"postal/rest/utils"

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

	// Run migrations
	log.Println("🔄 Running database migrations...")
	if err := repo.AutoMigrate(db); err != nil {
		log.Printf("❌ Migration failed: %v", err)
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	// Initialize Validator
	validator := utils.NewValidator()

	// Initialize repositories
	log.Println("🔄 Initializing repositories...")
	postRepo := post.NewRepository(db)
	versionRepo := post_version.NewRepository(db)

	// Initialize cache
	log.Println("🔄 Initializing cache...")
	var postCache post.PostCache
	writeRedisClient, err := cache.NewRedisClient(cfg.WriteRedisURL, cfg.EnableRedisTLSMode)
	if err != nil {
		log.Printf("⚠️ Failed to initialize Redis client, cache disabled: %v", err)
	} else if writeRedisClient != nil {
		postCache = cache.NewPostCache(writeRedisClient)
		defer func() {
			if closeErr := writeRedisClient.Close(); closeErr != nil {
				log.Printf("⚠️ Failed to close Redis client: %v", closeErr)
			}
		}()
		log.Println("✅ Redis cache initialized")
	}

	// Initialize services
	log.Println("🔄 Initializing services...")
	postService := post.NewService(postRepo, versionRepo, postCache)

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
