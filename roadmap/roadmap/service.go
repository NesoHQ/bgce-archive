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

func (s *service) UpdatePlannedCard(ctx context.Context, cardID string, params AddPlannedCardRequest, userID int64) error {
	plannedCard, err := s.repo.GetPlannedCard(ctx, cardID)
	if err != nil {
		return err
	}

	plannedCard.Title = params.Title
	plannedCard.Items = params.Items
	plannedCard.UpdatedBy = userID
	plannedCard.UpdatedAt = time.Now()

	return s.repo.UpdatePlannedCard(ctx, cardID, plannedCard)
}

func (s *service) DeletePlannedCard(ctx context.Context, cardID string) error {
	return s.repo.DeletePlannedCard(ctx, cardID)
}

func (s *service) UpdateInProgressCard(ctx context.Context, cardID string, params UpdateInProgressCardRequest, userID int64) error {
	inProgressCard, err := s.repo.GetInProgressCard(ctx, cardID)
	if err != nil {
		return err
	}

	inProgressCard.Title = params.Title
	inProgressCard.Items = params.Items
	inProgressCard.CompletionPercentage = params.CompletionPercentage
	inProgressCard.UpdatedBy = userID
	inProgressCard.UpdatedAt = time.Now()

	return s.repo.UpdateInProgressCard(ctx, cardID, inProgressCard)
}

func (s *service) DeleteInProgressCard(ctx context.Context, cardID string) error {
	return s.repo.DeleteInProgressCard(ctx, cardID)
}

func (s *service) UpdateCompletedCard(ctx context.Context, cardID string, params UpdateCompletedCardRequest, userID int64) error {
	completedCard, err := s.repo.GetCompletedCard(ctx, cardID)
	if err != nil {
		return err
	}

	completedCard.Title = params.Title
	completedCard.Items = params.Items
	completedCard.UpdatedBy = userID
	completedCard.UpdatedAt = time.Now()

	return s.repo.UpdateCompletedCard(ctx, cardID, completedCard)
}

func (s *service) DeleteCompletedCard(ctx context.Context, cardID string) error {
	return s.repo.DeleteCompletedCard(ctx, cardID)
}

func (s *service) MoveCardToInProgress(ctx context.Context, cardID string, updatedBy int64) error {
	// If the card is in Planned list
	plannedCard, err := s.repo.GetPlannedCard(ctx, cardID)
	if err == nil {
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

	// Else if the card is in Completed list
	completedCard, err := s.repo.GetCompletedCard(ctx, cardID)
	if err != nil {
		return err
	}

	inProgressCard := domain.InProgressCard{
		ID:                   completedCard.ID,
		Title:                completedCard.Title,
		Items:                completedCard.Items,
		CompletionPercentage: 0,
		StartedAt:            domain.GetPeriodFromTime(time.Now()),
		CreatedBy:            completedCard.CreatedBy,
		CreatedAt:            completedCard.CreatedAt,
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
	// If the card is in InProgress list
	inProgressCard, err := s.repo.GetInProgressCard(ctx, cardID)
	if err == nil {
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

	// Else if the card is in Planned list
	plannedCard, err := s.repo.GetPlannedCard(ctx, cardID)
	if err != nil {
		return err
	}

	completedCard := domain.CompletedCard{
		ID:          plannedCard.ID,
		Title:       plannedCard.Title,
		Items:       plannedCard.Items,
		CompletedAt: domain.GetPeriodFromTime(time.Now()),
		CreatedBy:   plannedCard.CreatedBy,
		CreatedAt:   plannedCard.CreatedAt,
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

func (s *service) MoveCardToPlanned(ctx context.Context, cardID string, updatedBy int64) error {
	// If the card is in InProgress list
	inProgressCard, err := s.repo.GetInProgressCard(ctx, cardID)
	if err == nil {
		plannedCard := domain.PlannedCard{
			ID:        inProgressCard.ID,
			Title:     inProgressCard.Title,
			Items:     inProgressCard.Items,
			PlannedAt: domain.GetPeriodFromTime(time.Now()),
			CreatedBy: inProgressCard.CreatedBy,
			CreatedAt: inProgressCard.CreatedAt,
			UpdatedBy: updatedBy,
			UpdatedAt: time.Now(),
		}
		return s.repo.MoveCardToPlanned(ctx, cardID, plannedCard)
	}

	// Else if the card is in Completed list
	completedCard, err := s.repo.GetCompletedCard(ctx, cardID)
	if err != nil {
		return err
	}

	plannedCard := domain.PlannedCard{
		ID:        completedCard.ID,
		Title:     completedCard.Title,
		Items:     completedCard.Items,
		PlannedAt: domain.GetPeriodFromTime(time.Now()),
		CreatedBy: completedCard.CreatedBy,
		CreatedAt: completedCard.CreatedAt,
		UpdatedBy: updatedBy,
		UpdatedAt: time.Now(),
	}

	return s.repo.MoveCardToPlanned(ctx, cardID, plannedCard)
}

func (s *service) CreateChangeLog(ctx context.Context, params CreateChangeLogRequest, userID int64) error {
	card := domain.ChangeLogCard{
		ID:        primitive.NewObjectID().Hex(),
		Title:     params.Title,
		Items:     params.Items,
		Month:     params.Month,
		Year:      params.Year,
		CreatedBy: userID,
		CreatedAt: time.Now(),
		UpdatedBy: userID,
		UpdatedAt: time.Now(),
	}
	return s.repo.CreateChangeLog(ctx, card)
}

func (s *service) UpdateChangeLog(ctx context.Context, cardID string, params CreateChangeLogRequest, userID int64) error {
	card, err := s.repo.GetChangeLog(ctx, cardID)
	if err != nil {
		return err
	}

	card.Title = params.Title
	card.Items = params.Items
	card.Month = params.Month
	card.Year = params.Year
	card.UpdatedBy = userID
	card.UpdatedAt = time.Now()

	return s.repo.UpdateChangeLog(ctx, cardID, card)
}

func (s *service) GetChangeLogs(ctx context.Context, page, limit int) ([]domain.ChangeLogCard, PaginationMeta, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	cards, totalCount, err := s.repo.GetChangeLogs(ctx, page, limit)
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

func (s *service) DeleteChangeLog(ctx context.Context, cardID string) error {
	return s.repo.DeleteChangeLog(ctx, cardID)
}
