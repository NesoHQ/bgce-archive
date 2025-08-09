package category

import (
	"context"

	"github.com/google/uuid"
)

type Service interface {
	CreateCategory(ctx context.Context, params CreateCategoryParams) error
	GetCategoryByID(ctx context.Context, CategoryUUID uuid.UUID) (*Category, error)
	// UpdateCategory(ctx context.Context, params UpdateCategoryReqParams) error
	// DeleteCategory(ctx context.Context, id uint) error
	// GetCategories(ctx context.Context, params GetCategoryReqParams) ([]Category, error)
}

type CtgryRepo interface {
	Insert(ctx context.Context, category Category) error
	Get(ctx context.Context, CategoryUUID uuid.UUID) (*Category, error)
	// Update(ctx context.Context, category Category) error
	// Delete(ctx context.Context, id uint) error
	// GetAll(ctx context.Context, params GetCategoryReqParams) ([]Category, error)
}
