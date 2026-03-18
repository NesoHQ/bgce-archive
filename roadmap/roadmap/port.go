package roadmap

import (
	"context"

	"roadmap/domain"
)

type Service interface {
	AddPlannedCard(ctx context.Context, card domain.PlannedCard) error
}

type Repository interface {
	AddPlannedCard(ctx context.Context, card domain.PlannedCard) error
}
