package subcategory

import (
	"context"
	"encoding/json"
	"errors"

	"cortex/ent/category"
	customerrors "cortex/pkg/custom_errors"
)

func (s *service) UpdateSubcategory(ctx context.Context, params UpdateSubcategoryParams) error {
	// Check if subcategory exists
	existingSubcategory, err := s.ent.Category.Query().
		Where(category.UUIDEQ(params.UUID.String())).
		First(ctx)
	if err != nil {
		return customerrors.ErrCategoryNotFound
	}

	// Check if it's actually a subcategory (has a parent)
	if existingSubcategory.ParentID == 0 {
		return errors.New("category is not a subcategory")
	}

	// If updating slug, check for uniqueness
	if params.Slug != nil && *params.Slug != existingSubcategory.Slug {
		exists, err := s.ent.Category.Query().
			Where(category.SlugEQ(*params.Slug)).
			Exist(ctx)
		if err != nil {
			return errors.New("failed to check slug uniqueness")
		}
		if exists {
			return customerrors.ErrSlugExists
		}
	}

	// Build update query
	updateQuery := s.ent.Category.UpdateOneID(existingSubcategory.ID).
		SetUpdatedBy(params.UpdatedBy)

	if params.Slug != nil {
		updateQuery = updateQuery.SetSlug(*params.Slug)
	}
	if params.Label != nil {
		updateQuery = updateQuery.SetLabel(*params.Label)
	}
	if params.Description != nil {
		updateQuery = updateQuery.SetDescription(*params.Description)
	}
	if params.Status != nil {
		updateQuery = updateQuery.SetStatus(category.Status(*params.Status))
	}
	if params.Meta != nil {
		// Convert json.RawMessage to map[string]interface{}
		var metaMap map[string]interface{}
		if err := json.Unmarshal(params.Meta, &metaMap); err == nil {
			updateQuery = updateQuery.SetMeta(metaMap)
		}
	}

	_, err = updateQuery.Save(ctx)
	if err != nil {
		return errors.New("failed to update subcategory")
	}

	return nil
}
