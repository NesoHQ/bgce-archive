package tenant

import (
	"context"

	"github.com/google/uuid"
)

func (s *service) DeleteTenant(ctx context.Context, uuid uuid.UUID) error {
	return s.repo.Delete(ctx, uuid)
}
