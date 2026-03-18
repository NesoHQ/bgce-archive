package cmd

import (
	"fmt"
	"net/http"

	"roadmap/config"
	"roadmap/repo"
	"roadmap/rest"
	"roadmap/rest/handlers"
	"roadmap/rest/middlewares"
	"roadmap/roadmap"

	limiterMemory "github.com/ulule/limiter/v3/drivers/store/memory"
)

func InitRest() {
	cfg := config.GetConfig()

	dbConnection, err := config.GetDbConnection(cfg.MongoDBURI, cfg.MonggoDBName)
	if err != nil {
		panic(err)
	}
	defer config.DisconnectDB(dbConnection.Client())

	// Repos & services
	roadmapRepo := repo.NewRoadmapRepository(dbConnection)
	roadmapService := roadmap.NewService(roadmapRepo)

	// Handlers
	h := handlers.NewHandlers(roadmapService)

	// Middlewares
	ipStore := limiterMemory.NewStore()
	mw := middlewares.NewMiddlewares(cfg.JWTSecret, ipStore)

	// Server
	handler, err := rest.NewServer(mw, h)
	if err != nil {
		panic(err)
	}

	addr := ":" + cfg.HTTPPort
	fmt.Printf("Server listening on %s\n", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		panic(err)
	}
}
