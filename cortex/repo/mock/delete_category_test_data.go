package mock_repo

import (
	"database/sql"
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

				mock.ExpectQuery(`SELECT deleted_at IS NOT NULL FROM categories WHERE uuid = \$1`).
					WithArgs(sqlmock.AnyArg()).
					WillReturnError(sql.ErrNoRows)
			},
			WantErr: customerrors.ErrCategoryNotFound,
		},
		{
			Name: "Category already deleted",
			ID:   uuid.NewString(),
			SetupMock: func() {
				mock.ExpectExec(`UPDATE categories SET deleted_at = \$1, status = \$2 WHERE uuid = \$3`).
					WithArgs(sqlmock.AnyArg(), "deleted", sqlmock.AnyArg()).
					WillReturnResult(sqlmock.NewResult(0, 0))

				mock.ExpectQuery(`SELECT deleted_at IS NOT NULL FROM categories WHERE uuid = \$1`).
					WithArgs(sqlmock.AnyArg()).
					WillReturnRows(sqlmock.NewRows([]string{"deleted_at IS NOT NULL"}).
						AddRow(true))
			},
			WantErr: customerrors.ErrCategoryAlreadyDeleted,
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
