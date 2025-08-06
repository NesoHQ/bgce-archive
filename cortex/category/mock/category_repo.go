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

func (m *CategoryRepo) Delete(ctx context.Context, uuid uuid.UUID) error {
	args := m.Called(ctx, uuid)
	return args.Error(0)
}
