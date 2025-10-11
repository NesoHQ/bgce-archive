package category

import (
	"context"
	"time"

	"cortex/ent"

	"github.com/google/uuid"
)

type Service interface {
	CreateCategory(ctx context.Context, params CreateCategoryParams) error
	FindCategoryBySlug(ctx context.Context, slug string) (*ent.Category, error)
	FindCategoryByUUID(ctx context.Context, uuid uuid.UUID) (*ent.Category, error)
	FindCategoryByID(ctx context.Context, id int) (*ent.Category, error)
	DeleteCategoryByUUID(ctx context.Context, uuid uuid.UUID) error
	GetCategoryList(ctx context.Context, filter GetCategoryFilter) ([]*Category, error)
	UpdateCategory(ctx context.Context, params UpdateCategoryParams) error

	CreateSubcategory(ctx context.Context, params CreateSubcategoryParams) error
	// GetSubcategoriesByParentID(ctx context.Context, parentID int, filter GetSubcategoryFilter) ([]*Category, error)
	// UpdateSubcategory(ctx context.Context, params UpdateSubcategoryParams) error
	// DeleteSubcategory(ctx context.Context, id int, deletedBy int) error
}

type Cache interface {
	SIsMember(ctx context.Context, key, member string) (bool, error)
	SAdd(ctx context.Context, key string, expiration time.Duration, members ...any) error
	SlugsKey() string
	Set(ctx context.Context, key string, value any, expiration time.Duration) error
	SetJSON(ctx context.Context, key string, value any, expiration time.Duration) error
	ZAdd(ctx context.Context, key string, expiration time.Duration, members ...any) error
	CategoryUUIDKey(uuid uuid.UUID) string
	CategoryObjectKey(uuid uuid.UUID) string
	CategoryTopPostsKey(uuid uuid.UUID) string
}
