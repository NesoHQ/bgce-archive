package handlers

import "roadmap/roadmap"

type Handlers struct {
	roadmapService roadmap.Service
}

func NewHandlers(roadmapService roadmap.Service) *Handlers {
	return &Handlers{roadmapService: roadmapService}
}
