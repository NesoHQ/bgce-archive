package category

import "context"

func (svc *service) GetCategory(ctx context.Context, filter GetCategoryFilter) (*Category, error) {
	return svc.ctgryRepo.Get(ctx, GetCategoryFilter{
		UUID: filter.UUID,
	})
}
