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
	UpdatePlannedCard(ctx context.Context, cardID string, params AddPlannedCardRequest, userID int64) error
	DeletePlannedCard(ctx context.Context, cardID string) error
	UpdateInProgressCard(ctx context.Context, cardID string, params UpdateInProgressCardRequest, userID int64) error
	DeleteInProgressCard(ctx context.Context, cardID string) error
	UpdateCompletedCard(ctx context.Context, cardID string, params UpdateCompletedCardRequest, userID int64) error
	DeleteCompletedCard(ctx context.Context, cardID string) error
	MoveCardToInProgress(ctx context.Context, cardID string, updatedBy int64) error
	MoveCardToCompleted(ctx context.Context, cardID string, updatedBy int64) error
	MoveCardToPlanned(ctx context.Context, cardID string, updatedBy int64) error
	CreateChangeLog(ctx context.Context, params CreateChangeLogRequest, userID int64) error
	UpdateChangeLog(ctx context.Context, cardID string, params CreateChangeLogRequest, userID int64) error
	GetChangeLogs(ctx context.Context, page, limit int) ([]domain.ChangeLogCard, PaginationMeta, error)
	DeleteChangeLog(ctx context.Context, cardID string) error
}

type Repository interface {
	GetPlannedCards(ctx context.Context, page, limit int) ([]domain.PlannedCard, int, error)
	GetInProgressCards(ctx context.Context, page, limit int) ([]domain.InProgressCard, int, error)
	GetCompletedCards(ctx context.Context, page, limit int) ([]domain.CompletedCard, int, error)
	GetChangeLogs(ctx context.Context, page, limit int) ([]domain.ChangeLogCard, int, error)
	AddPlannedCard(ctx context.Context, card domain.PlannedCard) error
	UpdatePlannedCard(ctx context.Context, cardID string, card domain.PlannedCard) error
	DeletePlannedCard(ctx context.Context, cardID string) error
	UpdateInProgressCard(ctx context.Context, cardID string, card domain.InProgressCard) error
	DeleteInProgressCard(ctx context.Context, cardID string) error
	UpdateCompletedCard(ctx context.Context, cardID string, card domain.CompletedCard) error
	DeleteCompletedCard(ctx context.Context, cardID string) error
	GetPlannedCard(ctx context.Context, cardID string) (domain.PlannedCard, error)
	GetInProgressCard(ctx context.Context, cardID string) (domain.InProgressCard, error)
	GetCompletedCard(ctx context.Context, cardID string) (domain.CompletedCard, error)
	GetChangeLog(ctx context.Context, cardID string) (domain.ChangeLogCard, error)
	MoveCardToInProgress(ctx context.Context, cardID string, inProgressCard domain.InProgressCard) error
	MoveCardToCompleted(ctx context.Context, cardID string, completedCard domain.CompletedCard) error
	MoveCardToPlanned(ctx context.Context, cardID string, plannedCard domain.PlannedCard) error
	CreateChangeLog(ctx context.Context, card domain.ChangeLogCard) error
	UpdateChangeLog(ctx context.Context, cardID string, card domain.ChangeLogCard) error
	DeleteChangeLog(ctx context.Context, cardID string) error
}
