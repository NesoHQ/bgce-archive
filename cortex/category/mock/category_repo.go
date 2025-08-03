package mock_category

import (
	"context"

	"github.com/stretchr/testify/mock"

	"cortex/category"
)

type CategoryRepo struct {
	mock.Mock
}

func (m *CategoryRepo) Insert(ctx context.Context, cat category.Category) error {
	args := m.Called(ctx, cat)
	return args.Error(0)
}
