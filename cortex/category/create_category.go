package category

import (
	"context"
	"time"
)

func (svc *service) CreateCategory(ctx context.Context, params CreateCategoryParams) error {
	return svc.ctgryRepo.Insert(ctx, Category{
		Slug:        params.Slug,
		Label:       params.Label,
		Description: params.Description,
		CreatedBy:   params.CreatedBy,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Status:      StatusPending,
		Meta:        params.Meta,
	})
}
