package mock_repo

import (
	"errors"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"

	customerrors "cortex/pkg/custom_errors"
)

type DeleteCategory struct {
	Name      string
	ID        string
	SetupMock func()
	WantErr   error
}

func DeleteCategoryTestData(mock sqlmock.Sqlmock) []DeleteCategory {
	return []DeleteCategory{
		{
			Name: "success",
			ID:   uuid.NewString(),
			SetupMock: func() {
				mock.ExpectExec(`UPDATE categories SET deleted_at = \$1, status = \$2 WHERE uuid = \$3`).
					WithArgs(sqlmock.AnyArg(), "deleted", sqlmock.AnyArg()).
					WillReturnResult(sqlmock.NewResult(0, 1))
			},
			WantErr: nil,
		},
		{
			Name: "Category not found",
			ID:   uuid.NewString(),
			SetupMock: func() {
				mock.ExpectExec(`UPDATE categories SET deleted_at = \$1, status = \$2 WHERE uuid = \$3`).
					WithArgs(sqlmock.AnyArg(), "deleted", sqlmock.AnyArg()).
					WillReturnResult(sqlmock.NewResult(0, 0))
			},
			WantErr: customerrors.ErrCategoryNotFound,
		},
		{
			Name: "other db error",
			ID:   uuid.NewString(),
			SetupMock: func() {
				mock.ExpectExec(`UPDATE categories SET deleted_at = \$1, status = \$2 WHERE uuid = \$3`).
					WithArgs(sqlmock.AnyArg(), "deleted", sqlmock.AnyArg()).
					WillReturnError(errors.New("failed to delete category"))
			},
			WantErr: errors.New("failed to delete category"),
		},
	}
}
