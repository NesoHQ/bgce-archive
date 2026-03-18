package handlers

import "roadmap/roadmap"

type Handlers struct {
	roadmap roadmap.Service
}

func NewHandlers(roadmap roadmap.Service) *Handlers {
	return &Handlers{roadmap: roadmap}
}
