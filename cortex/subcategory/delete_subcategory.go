package subcategory

import (
	"context"
	"errors"

	"cortex/ent/category"
	customerrors "cortex/pkg/custom_errors"

	"github.com/google/uuid"
)

func (s *service) DeleteSubcategory(ctx context.Context, uuid uuid.UUID, deletedBy int) error {
	// Check if subcategory exists
	existingSubcategory, err := s.ent.Category.Query().
		Where(category.UUIDEQ(uuid.String())).
		First(ctx)
	if err != nil {
		return customerrors.ErrCategoryNotFound
	}

	// Check if it's actually a subcategory (has a parent)
	if existingSubcategory.ParentID == 0 {
		return errors.New("category is not a subcategory")
	}

	// Soft delete the subcategory
	_, err = s.ent.Category.UpdateOneID(existingSubcategory.ID).
		SetDeletedBy(deletedBy).
		SetStatus(category.StatusDeleted).
		Save(ctx)
	if err != nil {
		return errors.New("failed to delete subcategory")
	}

	return nil
}
