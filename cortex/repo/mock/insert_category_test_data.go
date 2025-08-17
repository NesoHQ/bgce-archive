package mock_repo

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/lib/pq"

	customerrors "cortex/pkg/custom_errors"
)

type InsertCategory struct {
	Name      string
	SetupMock func()
	WantErr   error
}

func InsertCategoryTestData(now time.Time, mock sqlmock.Sqlmock) []InsertCategory {
	jsonMeta, _ := json.Marshal("test-meta")

	return []InsertCategory{
		{
			Name: "success",
			SetupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, nil, nil, nil, now, now, nil, nil, "pending", sqlmock.AnyArg()).
					WillReturnRows(sqlmock.NewRows([]string{
						"id", "uuid", "slug", "label", "description", "created_by", "updated_by", "approved_by", "deleted_by",
						"created_at", "updated_at", "approved_at", "deleted_at", "status", "meta",
					}).
						AddRow(1, "123e4567-e89b-12d3-a456-426614174000", "slug-test", "Label", "desc", 1, nil, nil, nil, now, now, nil, nil, "pending", jsonMeta))
			},
			WantErr: nil,
		},
		{
			Name: "slug unique violation",
			SetupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, nil, nil, nil, now, now, nil, nil, "pending", sqlmock.AnyArg()).
					WillReturnError(&pq.Error{Code: "23505", Constraint: "categories_slug_key"})
			},
			WantErr: customerrors.ErrSlugExists,
		},
		{
			Name: "missing required field",
			SetupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, nil, nil, nil, now, now, nil, nil, "pending", sqlmock.AnyArg()).
					WillReturnError(&pq.Error{Code: "23502"})
			},
			WantErr: errors.New("missing required field"),
		},
		{
			Name: "other db error",
			SetupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, nil, nil, nil, now, now, nil, nil, "pending", sqlmock.AnyArg()).
					WillReturnError(errors.New("connection lost"))
			},
			WantErr: errors.New("failed to insert category"),
		},
	}
}
