package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"path/filepath"
	"time"

	"community/comment"
	"community/config"
	"community/discussion"
	"community/moderation"
	"community/repo"
	"community/rest"
	"community/rest/handlers"
	"community/rest/middlewares"
	"community/rest/utils"

	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

var restCmd = &cobra.Command{
	Use:   "rest",
	Short: "Start the REST API server",
	Long:  `Start the HTTP REST API server for the Community service`,
	RunE:  runRESTServer,
}

func runRESTServer(cmd *cobra.Command, args []string) error {
	// Load configuration
	cfg := config.LoadConfig()
	log.Printf("🚀 Starting %s v%s in %s mode", cfg.ServiceName, cfg.Version, cfg.Mode)
	log.Printf("📊 Database: %s", cfg.CommunityDBDSN)
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
	sqlDB, err := sql.Open("postgres", cfg.CommunityDBDSN)
	if err != nil {
		log.Printf("❌ Failed to connect to database for migrations: %v", err)
		return fmt.Errorf("failed to connect to database for migrations: %w", err)
	}

	migrationsPath := filepath.Join(".", "migrations")
	if err := repo.RunMigrations(repo.MigrationConfig{
		DB:                  sqlDB,
		MigrationsPath:      migrationsPath,
		DatabaseName:        "community",
		MigrationsTableName: "community_schema_migrations",
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
	commentRepo := repo.NewCommentRepository(db)
	discussionRepo := repo.NewDiscussionRepository(db)

	log.Println("🔄 Initializing content moderation...")
	slangConfigPath := filepath.Join(".", "config", "slang.json")
	var checker moderation.Moderator
	regexModerator, err := moderation.NewRegexModerator(slangConfigPath)
	if err != nil {
		slog.Warn("RegexModerator unavailable, falling back to NoOpChecker",
			"path", slangConfigPath,
			"error", err,
		)
		checker = &moderation.NoOpChecker{}
	} else {
		checker = regexModerator
		log.Println("✅ RegexModerator initialized")
	}

	// Initialize services
	log.Println("🔄 Initializing services...")
	commentService := comment.NewService(commentRepo, checker)
	discussionService := discussion.NewService(discussionRepo)

	// Initialize handlers
	log.Println("🔄 Initializing handlers...")
	h := handlers.NewHandlers(commentService, discussionService, validator)

	// Initialize middlewares
	log.Println("🔄 Initializing middlewares...")
	ipStore := memory.NewStoreWithOptions(limiter.StoreOptions{
		Prefix:          "community:limiter",
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
