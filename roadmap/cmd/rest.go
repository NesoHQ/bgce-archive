package cmd

import (
	"log"
	"net/http"

	"roadmap/config"
	"roadmap/repo"
	"roadmap/rest"
	"roadmap/rest/handlers"
	"roadmap/rest/middlewares"
	"roadmap/roadmap"

	"github.com/spf13/cobra"
	limiterMemory "github.com/ulule/limiter/v3/drivers/store/memory"
)

var restCmd = &cobra.Command{
	Use:   "rest",
	Short: "Start the REST API server",
	Long:  `Start the HTTP REST API server for the Roadmap service`,
	Run: func(cmd *cobra.Command, args []string) {
		runRESTServer()
	},
}

func runRESTServer() {
	cfg := config.GetConfig()
	log.Printf("🚀 Starting %s v%s in %s mode", cfg.ServiceName, cfg.Version, cfg.Mode)
	log.Printf("📊 MongoDB URI: %s", cfg.MongoDBURI)
	log.Printf("📊 MongoDB DB Name: %s", cfg.MonggoDBName)
	log.Printf("🔌 Port: %s", cfg.HTTPPort)

	log.Println("🔄 Connecting to MongoDB...")
	dbConnection, err := config.GetDbConnection(cfg.MongoDBURI, cfg.MonggoDBName)
	if err != nil {
		log.Printf("❌ Database connection failed: %v", err)
		panic(err)
	}
	defer config.DisconnectDB(dbConnection.Client())

	// Repos & services
	log.Println("🔄 Initializing repositories & services...")
	roadmapRepo := repo.NewRoadmapRepository(dbConnection)
	roadmapService := roadmap.NewService(roadmapRepo)

	// Handlers
	log.Println("🔄 Initializing handlers...")
	h := handlers.NewHandlers(roadmapService)

	// Middlewares
	log.Println("🔄 Initializing middlewares...")
	ipStore := limiterMemory.NewStore()
	mw := middlewares.NewMiddlewares(cfg.JWTSecret, ipStore)

	// Server
	log.Println("🔄 Creating HTTP server...")
	handler, err := rest.NewServer(mw, h)
	if err != nil {
		log.Printf("❌ Failed to create server: %v", err)
		panic(err)
	}

	addr := ":" + cfg.HTTPPort
	log.Printf("✅ Server ready!")
	log.Printf("🌐 Listening on http://localhost%s", addr)
	log.Printf("📚 API Base: http://localhost%s/api/v1", addr)
	log.Println("Press Ctrl+C to stop")

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Printf("❌ Server error: %v", err)
		panic(err)
	}
}
