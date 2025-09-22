package category

import (
	"context"
	"errors"

	"cortex/ent"
	"cortex/ent/category"
)

func (s *service) FindCategoryByID(ctx context.Context, id int) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.IDEQ(id),
	).First(ctx)
	if err != nil {
		return nil, errors.New("ent: category not found")
	}
	return category, nil
}
