package mock_handler

import (
	"context"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"

	"cortex/category"
)

type CategoryService struct {
	mock.Mock
}

func (m *CategoryService) CreateCategory(ctx context.Context, model category.CreateCategoryParams) error {
	args := m.Called(ctx, model)
	return args.Error(0)
}

func (m *CategoryService) GetCategoryByID(ctx context.Context, categoryUUID uuid.UUID) (*category.Category, error) {
	args := m.Called(ctx, categoryUUID)

	if args.Get(0) == nil {
		return nil, args.Error(1)
	}

	return args.Get(0).(*category.Category), args.Error(1)
}
