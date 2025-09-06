package category

import (
	"context"

	customerrors "cortex/pkg/custom_errors"
)

func (svc *service) DeleteCategory(ctx context.Context, filter GetCategoryFilter) error {
	category, err := svc.ctgryRepo.Get(ctx, GetCategoryFilter{
		UUID: filter.UUID,
	})
	if err != nil {
		return err
	}

	if category == nil {
		return customerrors.ErrCategoryNotFound
	}

	if category.Status == "deleted" {
		return customerrors.ErrCategoryAlreadyDeleted
	}

	return svc.ctgryRepo.Delete(ctx, GetCategoryFilter{
		UUID: filter.UUID,
	})
}
