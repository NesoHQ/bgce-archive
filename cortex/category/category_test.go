package category_test

import (
	"context"

	"cortex/category"

	"github.com/stretchr/testify/mock"
)

type MockCategoryRepo struct {
	mock.Mock
}

func (m *MockCategoryRepo) Insert(ctx context.Context, cat category.Category) error {
	args := m.Called(ctx, cat)
	return args.Error(0)
}
