package category

import (
	"context"
	"errors"

	"cortex/ent"
	"cortex/ent/category"

	"github.com/google/uuid"
)

func (s *service) FindCategoryByUUID(ctx context.Context, uid uuid.UUID) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.UUIDEQ(uid.String()),
	).First(ctx)
	if err != nil {
		return nil, errors.New("category not found")
	}
	return category, nil
}
