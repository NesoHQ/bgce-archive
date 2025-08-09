package mock_category

import (
	"context"

	"github.com/google/uuid"
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

func (m *CategoryRepo) Get(ctx context.Context, id uuid.UUID) (*category.Category, error) {
	args := m.Called(ctx, id)
	if cat, ok := args.Get(0).(*category.Category); ok {
		return cat, args.Error(1)
	}
	return nil, args.Error(1)
}
