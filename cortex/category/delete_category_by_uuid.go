package category

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

func (s *service) DeleteCategoryByUUID(ctx context.Context, uuid uuid.UUID) error {
	category, err := s.FindCategoryByUUID(ctx, uuid)
	if err != nil {
		return err
	}
	err = s.ent.Category.DeleteOne(category).Exec(ctx)
	if err != nil {
		return errors.New("ent: category deletion failed")
	}
	return nil
}
