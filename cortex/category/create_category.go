package category

import (
	"context"
	"time"
)

func (s *service) CreateCategory(ctx context.Context, model CreateCategoryModel) error {
	return s.ctgryRepo.Insert(ctx, Category{
		Slug:        model.Slug,
		Label:       model.Label,
		Description: model.Description,
		CreatedBy:   model.CreatedBy,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Status:      StatusPending,
		Meta:        model.Meta,
	})
}
