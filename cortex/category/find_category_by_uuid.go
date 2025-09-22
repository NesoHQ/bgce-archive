package category

import (
	"context"
	"cortex/ent"
	"cortex/ent/category"
	"errors"

	"github.com/google/uuid"
)

func (s *service) FindCategoryByUUID(ctx context.Context, uid uuid.UUID) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.UUIDEQ(uid.String()),
	).First(ctx)
	if err != nil {
		return nil, errors.New("ent: category not found")
	}
	return category, nil
}
