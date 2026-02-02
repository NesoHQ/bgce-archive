package category

import (
	"context"
	"encoding/json"
	"errors"

	"cortex/ent/category"
	customerrors "cortex/pkg/custom_errors"
)

func (s *service) UpdateCategory(ctx context.Context, params UpdateCategoryParams) error {
	// 1. Find the category by the current slug
	cat, err := s.FindCategoryBySlug(ctx, *params.Slug)
	if err != nil {
		return customerrors.ErrCategoryNotFound
	}

	update := s.ent.Category.UpdateOne(cat)

	// 2. Check if the new slug is provided and different from current
	if params.NewSlug != nil && *params.NewSlug != cat.Slug {
		existing, _ := s.FindCategoryBySlug(ctx, *params.NewSlug)
		if existing != nil {
			return customerrors.ErrSlugExists
		}
		update.SetSlug(*params.NewSlug)
	}

	// 3. Optional fields
	if params.Label != nil {
		update.SetLabel(*params.Label)
	}
	if params.Description != nil {
		update.SetDescription(*params.Description)
	}
	if params.Status != nil {
		update.SetStatus(category.Status(*params.Status))
	}
	if params.Meta != nil {
		var meta map[string]interface{}
		if err := json.Unmarshal(params.Meta, &meta); err != nil {
			return errors.New("invalid meta JSON")
		}
		update.SetMeta(meta)
	}

	// 4. Set updater and optional approval fields
	update.SetUpdatedBy(params.UpdatedBy)

	if params.ApprovedBy != 0 {
		update.SetApprovedBy(params.ApprovedBy)
	}
	if !params.ApprovedAt.IsZero() {
		update.SetApprovedAt(params.ApprovedAt)
	}

	// 5. Save changes
	_, err = update.Save(ctx)
	if err != nil {
		return errors.New("ent: category update failed")
	}

	return nil
}
