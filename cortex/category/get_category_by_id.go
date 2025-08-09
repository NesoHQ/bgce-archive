package category

import (
	"context"

	"github.com/google/uuid"
)

func (svc *service) GetCategoryByID(ctx context.Context, CategoryUUID uuid.UUID) (*Category, error) {
	return svc.ctgryRepo.Get(ctx, CategoryUUID)
}
