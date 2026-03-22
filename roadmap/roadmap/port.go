package roadmap

import (
	"context"
	"errors"

	"roadmap/domain"
)

var ErrCardNotFound = errors.New("card not found")

type Service interface {
	GetPlannedCards(ctx context.Context, page, limit int) ([]domain.PlannedCard, PaginationMeta, error)
	GetInProgressCards(ctx context.Context, page, limit int) ([]domain.InProgressCard, PaginationMeta, error)
	GetCompletedCards(ctx context.Context, page, limit int) ([]domain.CompletedCard, PaginationMeta, error)
	AddPlannedCard(ctx context.Context, params AddPlannedCardRequest, userID int64) error
	MoveCardToInProgress(ctx context.Context, cardID string, updatedBy int64) error
	MoveCardToCompleted(ctx context.Context, cardID string, updatedBy int64) error
}

type Repository interface {
	GetPlannedCards(ctx context.Context, page, limit int) ([]domain.PlannedCard, int, error)
	GetInProgressCards(ctx context.Context, page, limit int) ([]domain.InProgressCard, int, error)
	GetCompletedCards(ctx context.Context, page, limit int) ([]domain.CompletedCard, int, error)
	AddPlannedCard(ctx context.Context, card domain.PlannedCard) error
	GetPlannedCard(ctx context.Context, cardID string) (domain.PlannedCard, error)
	GetInProgressCard(ctx context.Context, cardID string) (domain.InProgressCard, error)
	MoveCardToInProgress(ctx context.Context, cardID string, inProgressCard domain.InProgressCard) error
	MoveCardToCompleted(ctx context.Context, cardID string, completedCard domain.CompletedCard) error
}
