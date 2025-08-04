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
