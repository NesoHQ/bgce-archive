package mock_handler

import (
	"context"

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

func (m *CategoryService) DeleteCategory(ctx context.Context, filter category.GetCategoryFilter) error {
	return nil
}

func (m *CategoryService) GetCategory(ctx context.Context, filter category.GetCategoryFilter) (*category.Category, error) {
	return nil, nil
}
