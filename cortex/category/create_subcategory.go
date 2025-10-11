package category

import (
	"context"
	"errors"
	"fmt"

	"cortex/ent/category"
	customerrors "cortex/pkg/custom_errors"

	"github.com/google/uuid"
)

func (s *service) CreateSubcategory(ctx context.Context, params CreateSubcategoryParams) error {
	// Parse parent UUID
	parentUUID, err := uuid.Parse(params.ParentUUID)
	if err != nil {
		return fmt.Errorf("invalid parent UUID: %w", err)
	}

	// Find parent category by UUID to get its integer ID
	parentCategory, err := s.ent.Category.Query().
		Where(category.UUIDEQ(parentUUID.String())).
		First(ctx)
	if err != nil {
		return errors.New("parent category not found")
	}

	// Check if slug already exists
	exists, err := s.ent.Category.Query().
		Where(category.Slug(params.Slug)).
		Exist(ctx)
	if err != nil {
		return errors.New("failed to check slug uniqueness")
	}
	if exists {
		return customerrors.ErrSlugExists
	}

	// Create the subcategory
	_, err = s.ent.Category.Create().
		SetSlug(params.Slug).
		SetLabel(params.Label).
		SetDescription(params.Description).
		SetCreatedBy(params.CreatorID).
		SetParentID(parentCategory.ID).
		SetMeta(params.Meta).
		Save(ctx)
	if err != nil {
		return errors.New("failed to create subcategory")
	}

	return nil
}
