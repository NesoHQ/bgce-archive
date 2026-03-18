package roadmap

import (
	"context"

	"roadmap/domain"
)

type service struct {
	repo Repository
}

func (s *service) AddPlannedCard(ctx context.Context, card domain.PlannedCard) error {
	return s.repo.AddPlannedCard(ctx, card)
}
