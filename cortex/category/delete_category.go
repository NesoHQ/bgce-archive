package category

import (
	"context"
)

func (svc *service) DeleteCategory(ctx context.Context, uuid string) error {
	return svc.ctgryRepo.Delete(ctx, uuid)
}
