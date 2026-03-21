package roadmap

import (
	"context"
	"time"

	"roadmap/domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	repo Repository
}

func (s *service) AddPlannedCard(ctx context.Context, params AddPlannedCardRequest, userID int64) error {
	card := domain.PlannedCard{
		ID:        primitive.NewObjectID().Hex(),
		Title:     params.Title,
		Items:     params.Items,
		PlannedAt: domain.GetPeriodFromTime(time.Now()),
		CreatedBy: userID,
		CreatedAt: time.Now(),
		UpdatedBy: userID,
		UpdatedAt: time.Now(),
	}
	return s.repo.AddPlannedCard(ctx, card)
}

func (s *service) MoveCardToInProgress(ctx context.Context, cardID string, updatedBy int64) error {
	plannedCard, err := s.repo.GetPlannedCard(ctx, cardID)
	if err != nil {
		return err
	}

	inProgressCard := domain.InProgressCard{
		ID:                   plannedCard.ID,
		Title:                plannedCard.Title,
		Items:                plannedCard.Items,
		CompletionPercentage: 0,
		StartedAt:            domain.GetPeriodFromTime(time.Now()),
		CreatedBy:            plannedCard.CreatedBy,
		CreatedAt:            plannedCard.CreatedAt,
		UpdatedBy:            updatedBy,
		UpdatedAt:            time.Now(),
	}

	return s.repo.MoveCardToInProgress(ctx, cardID, inProgressCard)
}
