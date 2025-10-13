package subcategory

import (
	"context"
	"errors"
	"time"

	"cortex/ent"
	"cortex/ent/category"

	"github.com/google/uuid"
)

func (s *service) GetSubcategoriesByParentID(ctx context.Context, parentUUID uuid.UUID, filter GetSubcategoryFilter) ([]*Subcategory, error) {
	// First find the parent category by UUID to get its ID
	parentCategory, err := s.ent.Category.Query().
		Where(category.UUIDEQ(parentUUID.String())).
		First(ctx)
	if err != nil {
		return nil, errors.New("parent category not found")
	}

	// Build query for subcategories
	query := s.ent.Category.Query().
		Where(category.ParentIDEQ(parentCategory.ID))

	// Apply filters
	if filter.ID != nil {
		query = query.Where(category.IDEQ(*filter.ID))
	}
	if filter.UUID != nil {
		query = query.Where(category.UUIDEQ(filter.UUID.String()))
	}
	if filter.Slug != nil {
		query = query.Where(category.SlugEQ(*filter.Slug))
	}
	if filter.Label != nil {
		query = query.Where(category.LabelEQ(*filter.Label))
	}
	if filter.Status != nil {
		query = query.Where(category.StatusEQ(category.Status(*filter.Status)))
	}
	if filter.Limit != nil {
		query = query.Limit(*filter.Limit)
	}
	if filter.Offset != nil {
		query = query.Offset(*filter.Offset)
	}
	if filter.SortBy != nil && filter.SortOrder != nil {
		switch *filter.SortBy {
		case "created_at":
			if *filter.SortOrder == "desc" {
				query = query.Order(ent.Desc(category.FieldCreatedAt))
			} else {
				query = query.Order(ent.Asc(category.FieldCreatedAt))
			}
		case "label":
			if *filter.SortOrder == "desc" {
				query = query.Order(ent.Desc(category.FieldLabel))
			} else {
				query = query.Order(ent.Asc(category.FieldLabel))
			}
		case "slug":
			if *filter.SortOrder == "desc" {
				query = query.Order(ent.Desc(category.FieldSlug))
			} else {
				query = query.Order(ent.Asc(category.FieldSlug))
			}
		}
	}

	subcategories, err := query.All(ctx)
	if err != nil {
		return nil, errors.New("failed to retrieve subcategories")
	}

	var result []*Subcategory
	for _, sc := range subcategories {
		subcategoryUUID, err := uuid.Parse(sc.UUID)
		if err != nil {
			continue // Skip invalid UUIDs
		}

		// Convert int fields to *int for optional fields
		var updatedBy, approvedBy, deletedBy *int
		if sc.UpdatedBy != 0 {
			updatedBy = &sc.UpdatedBy
		}
		if sc.ApprovedBy != 0 {
			approvedBy = &sc.ApprovedBy
		}
		if sc.DeletedBy != 0 {
			deletedBy = &sc.DeletedBy
		}

		// Convert time fields to *time.Time for optional fields
		var approvedAt, deletedAt *time.Time
		if !sc.ApprovedAt.IsZero() {
			approvedAt = &sc.ApprovedAt
		}
		if !sc.DeletedAt.IsZero() {
			deletedAt = &sc.DeletedAt
		}

		result = append(result, &Subcategory{
			ID:          sc.ID,
			ParentID:    sc.ParentID,
			UUID:        subcategoryUUID,
			Slug:        sc.Slug,
			Label:       sc.Label,
			Description: sc.Description,
			CreatedBy:   sc.CreatedBy,
			UpdatedBy:   updatedBy,
			ApprovedBy:  approvedBy,
			DeletedBy:   deletedBy,
			CreatedAt:   sc.CreatedAt,
			UpdatedAt:   sc.UpdatedAt,
			ApprovedAt:  approvedAt,
			DeletedAt:   deletedAt,
			Status:      string(sc.Status),
			Meta:        sc.Meta,
		})
	}

	return result, nil
}
