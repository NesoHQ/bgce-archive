package category

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/middlewares"
)

func (svc *service) CreateCategory(ctx context.Context, params CreateCategoryParams) error {
	useRedis := middlewares.IsRedisEnabled(ctx)

	if useRedis {
		exists, err := svc.cache.SIsMember(ctx, svc.cache.SlugsKey(), params.Slug)
		if err != nil {
			slog.Warn("Failed to check slug in cache", "error", err)
		} else if exists {
			return customerrors.ErrSlugExists
		}
	}

	cat, err := svc.ctgryRepo.Insert(ctx, Category{
		Slug:        params.Slug,
		Label:       params.Label,
		Description: params.Description,
		CreatedBy:   params.CreatedBy,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Status:      StatusPending,
		Meta:        params.Meta,
	})
	if err != nil {
		return err
	}

	if cat == nil {
		return fmt.Errorf("inserted category is nil")
	}

	if useRedis {
		if err := svc.cache.SAdd(ctx, svc.cache.SlugsKey(), params.Slug); err != nil {
			slog.Warn("Failed to add slug to cache", "error", err)
		}

		pkKey := svc.cache.CategoryUUIDKey(cat.UUID)
		if err := svc.cache.Set(ctx, pkKey, cat.ID); err != nil {
			slog.Warn("Failed to store category primary key in cache", "error", err)
		}

		catJSONKey := svc.cache.CategoryObjectKey(cat.UUID)
		if err := svc.cache.SetJSON(ctx, catJSONKey, cat); err != nil {
			slog.Warn("Failed to store category object in cache", "error", err)
		}

		topPostsKey := svc.cache.CategoryTopPostsKey(cat.UUID)
		if err := svc.cache.ZAddEmpty(ctx, topPostsKey); err != nil {
			slog.Warn("Failed to initialize empty top posts ZSET", "error", err)
		}
	}

	return nil
}
