package roadmap

import "roadmap/domain"

type AddPlannedCardRequest struct {
	Title     string        `json:"title"`
	Items     []string      `json:"items"`
	PlannedAt domain.Period `json:"plannedAt"`
}
