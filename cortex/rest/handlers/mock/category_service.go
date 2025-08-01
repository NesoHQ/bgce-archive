package mock_handler

import (
	"context"

	"github.com/stretchr/testify/mock"

	"cortex/category"
)

type MockCategoryService struct {
	mock.Mock
}

func (m *MockCategoryService) CreateCategory(ctx context.Context, model category.CreateCategoryModel) error {
	args := m.Called(ctx, model)
	return args.Error(0)
}
