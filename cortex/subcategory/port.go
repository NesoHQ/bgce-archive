package subcategory

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Service interface {
	CreateSubcategory(ctx context.Context, params CreateSubcategoryParams) error
	GetSubcategoriesByParentID(ctx context.Context, parentUUID uuid.UUID, filter GetSubcategoryFilter) ([]*Subcategory, error)
	GetSubcategoryByID(ctx context.Context, id int) (*Subcategory, error)
	GetSubcategoryByUUID(ctx context.Context, uuid uuid.UUID) (*Subcategory, error)
	UpdateSubcategory(ctx context.Context, params UpdateSubcategoryParams) error
	DeleteSubcategory(ctx context.Context, uuid uuid.UUID, deletedBy int) error
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
