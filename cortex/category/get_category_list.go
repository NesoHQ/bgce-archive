package category

import (
	"context"
	"errors"

	"cortex/ent"
	"cortex/ent/category"

	"github.com/google/uuid"
)

func (s *service) GetCategoryList(ctx context.Context, filter GetCategoryFilter) ([]*Category, error) {
	query := s.ent.Category.Query()

	if filter.ID != nil {
		query = query.Where(category.IDEQ(int(*filter.ID)))
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
			// Add more sort fields as needed
		}
	}

	categories, err := query.All(ctx)
	if err != nil {
		return nil, errors.New("ent: categories retrieval failed")
	}
	var result []*Category
	for _, c := range categories {
		parsedUUID, err := uuid.Parse(c.UUID)
		if err != nil {
			return nil, errors.New("ent: category UUID parsing failed")
		}
		result = append(result, &Category{
			ID:          c.ID,
			UUID:        parsedUUID,
			Slug:        c.Slug,
			Label:       c.Label,
			Description: c.Description,
			CreatedBy:   c.CreatorID,
			Meta:        c.Meta,
		})
	}
	return result, nil
}
