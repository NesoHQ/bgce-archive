package category

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"time"

	"cortex/ent"
	"cortex/ent/category"
	"cortex/logger"

	"github.com/google/uuid"
)

func (s *service) GetCategoryList(ctx context.Context, filter GetCategoryFilter) ([]*Category, error) {
	// Try cache first
	if s.cache != nil {
		cacheKey := buildCategoryListCacheKey(filter)
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil && cached != "" {
			var categories []*Category
			if err := json.Unmarshal([]byte(cached), &categories); err == nil {
				slog.InfoContext(ctx, "Cache HIT - returning category list from Redis", logger.Extra(map[string]any{
					"key": cacheKey,
				}))
				return categories, nil
			}
		}
	}

	// Cache MISS - query database
	slog.InfoContext(ctx, "Cache MISS - loading category list from DB")
	query := s.ent.Category.Query()

	// IMPORTANT: Only get top-level categories (no parent)
	query = query.Where(category.ParentIDIsNil())

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
			UpdatedBy:   &c.UpdatedBy,
			ApprovedBy:  &c.ApprovedBy,
			ApprovedAt:  &c.ApprovedAt,
			Status:      string(c.Status),
			CreatedAt:   c.CreatedAt,
			UpdatedAt:   c.UpdatedAt,
			Meta:        c.Meta,
		})
	}

	// Cache the result (30 minutes TTL - categories rarely change)
	// Cache FULL result set (without pagination) for better reuse
	if s.cache != nil {
		cacheKey := buildCategoryListCacheKey(filter)
		if err := s.cache.SetJSON(ctx, cacheKey, result, 30*time.Minute); err != nil {
			slog.ErrorContext(ctx, "Failed to cache category list", logger.Extra(map[string]any{
				"error": err.Error(),
			}))
		} else {
			slog.InfoContext(ctx, "Cached category list", logger.Extra(map[string]any{
				"key":   cacheKey,
				"count": len(result),
			}))
		}
	}

	return result, nil
}

func buildCategoryListCacheKey(filter GetCategoryFilter) string {
	// Build key WITHOUT limit/offset for better cache reuse
	key := "category:list"

	if filter.UUID != nil {
		key += ":uuid:" + filter.UUID.String()
	}
	if filter.Slug != nil {
		key += ":slug:" + *filter.Slug
	}
	if filter.Status != nil {
		key += ":status:" + *filter.Status
	}
	// Note: Removed limit/offset from cache key for better reuse
	return key
}
