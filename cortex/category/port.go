package category

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Service interface {
	CreateCategory(ctx context.Context, params CreateCategoryParams) error
	GetCategory(ctx context.Context, filter GetCategoryFilter) (*Category, error)
	// UpdateCategory(ctx context.Context, params UpdateCategoryReqParams) error
	DeleteCategory(ctx context.Context, filter GetCategoryFilter) error
	// GetCategories(ctx context.Context, params GetCategoryReqParams) ([]Category, error)
}

type CtgryRepo interface {
	Insert(ctx context.Context, category Category) (*Category, error)
	Get(ctx context.Context, flters GetCategoryFilter) (*Category, error)
	// Update(ctx context.Context, category Category) error
	Delete(ctx context.Context, filter GetCategoryFilter) error
	// GetAll(ctx context.Context, params GetCategoryReqParams) ([]Category, error)
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
