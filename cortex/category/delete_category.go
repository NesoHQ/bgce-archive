package category

import (
	"context"

	"github.com/google/uuid"
)

func (svc *service) DeleteCategory(ctx context.Context, uuid uuid.UUID) error {
	return svc.ctgryRepo.Delete(ctx, uuid)
}
