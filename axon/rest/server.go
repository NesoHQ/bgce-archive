// @d:\Codes\bgce-archive\axon\rest\server.go
package rest

import (
	"log"
	"net/http"

	"axon/rest/handlers"
	"axon/rest/swagger"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct {
	port                string
	notificationHandler *handlers.NotificationHandler
	templateHandler     *handlers.TemplateHandler
}

func NewServer(port string, notificationHandler *handlers.NotificationHandler, templateHandler *handlers.TemplateHandler) *Server {
	return &Server{
		port:                port,
		notificationHandler: notificationHandler,
		templateHandler:     templateHandler,
	}
}

func (s *Server) Start() error {
	r := chi.NewRouter()

	// CORS - Allow all origins for development
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	// Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Notification sending (NEW)
		r.Post("/notifications/send", s.notificationHandler.SendNotification)
		r.Post("/notifications/email", s.notificationHandler.SendEmail)

		// Notification preferences
		r.Get("/users/{id}/notification-preferences", s.notificationHandler.GetUserPreferences)
		r.Put("/users/{id}/notification-preferences", s.notificationHandler.UpdateUserPreferences)
		r.Get("/users/{id}/notifications", s.notificationHandler.GetNotificationHistory)

		// Templates (admin only - TODO: add auth middleware)
		r.Get("/notifications/templates", s.templateHandler.ListTemplates)
		r.Get("/notifications/templates/{id}", s.templateHandler.GetTemplate)
		r.Post("/notifications/templates", s.templateHandler.CreateTemplate)
		r.Put("/notifications/templates/{id}", s.templateHandler.UpdateTemplate)
	})

	swagger.SetupSwagger(r)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	log.Printf("Server starting on :%s", s.port)
	return http.ListenAndServe(":"+s.port, r)
}
