package category

import (
	"context"

	"github.com/google/uuid"
)

type Service interface {
	CreateCategory(ctx context.Context, params CreateCategoryParams) error
	// GetCategory(ctx context.Context, params GetCategoryReqParams) (*Category, error)
	// UpdateCategory(ctx context.Context, params UpdateCategoryReqParams) error
	DeleteCategory(ctx context.Context, uuid string) error
	// GetCategories(ctx context.Context, params GetCategoryReqParams) ([]Category, error)
}

type CtgryRepo interface {
	Insert(ctx context.Context, category Category) (*Category, error)
	Get(ctx context.Context, flters GetCategoryFilter) (*Category, error)
	// Update(ctx context.Context, category Category) error
	Delete(ctx context.Context, uuid string) error
	// GetAll(ctx context.Context, params GetCategoryReqParams) ([]Category, error)
}

type Cache interface {
	UseCache(ctx context.Context) (bool, error)
	SIsMember(ctx context.Context, key string, member any) (bool, error)
	SAdd(ctx context.Context, key string, members ...any) error
	SlugsKey() string
	Set(ctx context.Context, key string, value any) error
	SetJSON(ctx context.Context, key string, value any) error
	ZAddEmpty(ctx context.Context, key string) error
	CategoryUUIDKey(uuid uuid.UUID) string
	CategoryObjectKey(uuid uuid.UUID) string
	CategoryTopPostsKey(uuid uuid.UUID) string
}
