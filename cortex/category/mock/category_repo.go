package mock_category

import (
	"context"

	"github.com/stretchr/testify/mock"

	"cortex/category"
)

type MockCategoryRepo struct {
	mock.Mock
}

func (m *MockCategoryRepo) Insert(ctx context.Context, cat category.Category) error {
	args := m.Called(ctx, cat)
	return args.Error(0)
}
