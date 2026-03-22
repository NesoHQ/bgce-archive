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

func (s *service) GetPlannedCards(ctx context.Context, page, limit int) ([]domain.PlannedCard, PaginationMeta, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	cards, totalCount, err := s.repo.GetPlannedCards(ctx, page, limit)
	if err != nil {
		return nil, PaginationMeta{}, err
	}

	totalPages := (totalCount + limit - 1) / limit
	hasNextPage := page < totalPages
	hasPreviousPage := page > 1

	var nextPage *int
	if hasNextPage {
		np := page + 1
		nextPage = &np
	}

	var prevPage *int
	if hasPreviousPage {
		pp := page - 1
		prevPage = &pp
	}

	meta := PaginationMeta{
		Total:           totalCount,
		Page:            page,
		Limit:           limit,
		TotalPages:      totalPages,
		HasNextPage:     hasNextPage,
		HasPreviousPage: hasPreviousPage,
		NextPage:        nextPage,
		PrevPage:        prevPage,
	}

	return cards, meta, nil
}

func (s *service) MoveCardToCompleted(ctx context.Context, cardID string, updatedBy int64) error {
	inProgressCard, err := s.repo.GetInProgressCard(ctx, cardID)
	if err != nil {
		return err
	}
	if inProgressCard.ID == "" {
		return ErrCardNotFound
	}

	completedCard := domain.CompletedCard{
		ID:          inProgressCard.ID,
		Title:       inProgressCard.Title,
		Items:       inProgressCard.Items,
		CompletedAt: domain.GetPeriodFromTime(time.Now()),
		CreatedBy:   inProgressCard.CreatedBy,
		CreatedAt:   inProgressCard.CreatedAt,
		UpdatedBy:   updatedBy,
		UpdatedAt:   time.Now(),
	}

	return s.repo.MoveCardToCompleted(ctx, cardID, completedCard)
}

func (s *service) GetInProgressCards(ctx context.Context, page, limit int) ([]domain.InProgressCard, PaginationMeta, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	cards, totalCount, err := s.repo.GetInProgressCards(ctx, page, limit)
	if err != nil {
		return nil, PaginationMeta{}, err
	}

	totalPages := (totalCount + limit - 1) / limit
	hasNextPage := page < totalPages
	hasPreviousPage := page > 1

	var nextPage *int
	if hasNextPage {
		np := page + 1
		nextPage = &np
	}

	var prevPage *int
	if hasPreviousPage {
		pp := page - 1
		prevPage = &pp
	}

	meta := PaginationMeta{
		Total:           totalCount,
		Page:            page,
		Limit:           limit,
		TotalPages:      totalPages,
		HasNextPage:     hasNextPage,
		HasPreviousPage: hasPreviousPage,
		NextPage:        nextPage,
		PrevPage:        prevPage,
	}

	return cards, meta, nil
}

func (s *service) GetCompletedCards(ctx context.Context, page, limit int) ([]domain.CompletedCard, PaginationMeta, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	cards, totalCount, err := s.repo.GetCompletedCards(ctx, page, limit)
	if err != nil {
		return nil, PaginationMeta{}, err
	}

	totalPages := (totalCount + limit - 1) / limit
	hasNextPage := page < totalPages
	hasPreviousPage := page > 1

	var nextPage *int
	if hasNextPage {
		np := page + 1
		nextPage = &np
	}

	var prevPage *int
	if hasPreviousPage {
		pp := page - 1
		prevPage = &pp
	}

	meta := PaginationMeta{
		Total:           totalCount,
		Page:            page,
		Limit:           limit,
		TotalPages:      totalPages,
		HasNextPage:     hasNextPage,
		HasPreviousPage: hasPreviousPage,
		NextPage:        nextPage,
		PrevPage:        prevPage,
	}

	return cards, meta, nil
}
