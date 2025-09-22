package category

import (
	"context"
	"cortex/ent"
	"cortex/ent/category"
	"errors"
)

func (s *service) FindCategoryBySlug(ctx context.Context, slug string) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.SlugEQ(slug),
	).First(ctx)
	if err != nil {
		return nil, errors.New("ent: category not found")
	}
	return category, nil
}
