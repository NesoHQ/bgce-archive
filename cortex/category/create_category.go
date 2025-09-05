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

	existingCat, err := svc.ctgryRepo.Get(ctx, GetCategoryFilter{
		Slug: &params.Slug,
	})
	if err != nil && err != customerrors.ErrCategoryNotFound {
		return fmt.Errorf("failed to check existing category: %w", err)
	}

	if existingCat != nil {
		if useRedis {
			go svc.cacheCategory(existingCat)
		}
		return customerrors.ErrSlugExists
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
		go svc.cacheCategory(cat)
	}

	return nil
}

func (svc *service) cacheCategory(cat *Category) {
	cacheCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := svc.cache.SAdd(cacheCtx, svc.cache.SlugsKey(), 30*24*time.Hour, cat.Slug); err != nil {
		slog.Warn("Failed to add slug to cache", "error", err)
	}

	pkKey := svc.cache.CategoryUUIDKey(cat.UUID)
	if err := svc.cache.Set(cacheCtx, pkKey, cat.ID, 30*24*time.Hour); err != nil {
		slog.Warn("Failed to store category primary key in cache", "error", err)
	}

	catJSONKey := svc.cache.CategoryObjectKey(cat.UUID)
	if err := svc.cache.SetJSON(cacheCtx, catJSONKey, cat, 30*24*time.Hour); err != nil {
		slog.Warn("Failed to store category object in cache", "error", err)
	}

	topPostsKey := svc.cache.CategoryTopPostsKey(cat.UUID)
	if err := svc.cache.ZAdd(cacheCtx, topPostsKey, 30*24*time.Hour); err != nil {
		slog.Warn("Failed to initialize empty top posts ZSET", "error", err)
	}
}
