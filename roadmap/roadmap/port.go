package roadmap

import (
	"context"
	"errors"

	"roadmap/domain"
)

var ErrCardNotFound = errors.New("planned card not found")

type Service interface {
	AddPlannedCard(ctx context.Context, params AddPlannedCardRequest, userID int64) error
	MoveCardToInProgress(ctx context.Context, cardID string, updatedBy int64) error
}

type Repository interface {
	AddPlannedCard(ctx context.Context, card domain.PlannedCard) error
	GetPlannedCard(ctx context.Context, cardID string) (domain.PlannedCard, error)
	MoveCardToInProgress(ctx context.Context, cardID string, inProgressCard domain.InProgressCard) error
}
