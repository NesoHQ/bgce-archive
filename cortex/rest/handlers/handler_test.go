package handlers_test

import (
	"context"

	"cortex/category"

	"github.com/stretchr/testify/mock"
)

type MockCategoryService struct {
	mock.Mock
}

func (m *MockCategoryService) CreateCategory(ctx context.Context, model category.CreateCategoryModel) error {
	args := m.Called(ctx, model)
	return args.Error(0)
}
