package mock_category

import (
	"context"

	"github.com/stretchr/testify/mock"

	"cortex/category"
)

type CategoryRepo struct {
	mock.Mock
}

func (m *CategoryRepo) Insert(ctx context.Context, cat category.Category) (*category.Category, error) {
	args := m.Called(ctx, cat)
	if cat, ok := args.Get(0).(*category.Category); ok {
		return cat, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *CategoryRepo) Delete(ctx context.Context, filter category.GetCategoryFilter) error {
	args := m.Called(ctx, filter)
	return args.Error(0)
}

func (m *CategoryRepo) Get(ctx context.Context, filters category.GetCategoryFilter) (*category.Category, error) {
	args := m.Called(ctx, filters)
	if cat, ok := args.Get(0).(*category.Category); ok {
		return cat, args.Error(1)
	}
	return nil, args.Error(1)
}
