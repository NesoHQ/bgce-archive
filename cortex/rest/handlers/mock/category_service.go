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

func (m *CategoryService) DeleteCategory(ctx context.Context, uuid string) error {
	args := m.Called(ctx, uuid)
	return args.Error(0)
}
