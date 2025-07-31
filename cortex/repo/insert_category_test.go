package repo_test

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"cortex/category"
	customerrors "cortex/pkg/custom_errors"
	"cortex/repo"
)

func TestInsertCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	defer db.Close()

	writeDB := sqlx.NewDb(db, "sqlmock")

	r := repo.NewCtgryRepo(nil, writeDB, sq.StatementBuilder.PlaceholderFormat(sq.Dollar))

	now := time.Now()

	tests := []struct {
		name      string
		setupMock func()
		wantErr   error
	}{
		{
			name: "success",
			setupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, now, now, "pending", sqlmock.AnyArg()).
					WillReturnRows(sqlmock.NewRows([]string{"id", "uuid"}).AddRow(1, "123e4567-e89b-12d3-a456-426614174000"))
			},
			wantErr: nil,
		},
		{
			name: "slug unique violation",
			setupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, now, now, "pending", sqlmock.AnyArg()).
					WillReturnError(&pq.Error{Code: "23505", Constraint: "categories_slug_key"})
			},
			wantErr: customerrors.ErrSlugExists,
		},
		{
			name: "missing required field",
			setupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, now, now, "pending", sqlmock.AnyArg()).
					WillReturnError(&pq.Error{Code: "23502"})
			},
			wantErr: errors.New("missing required field"),
		},
		{
			name: "other db error",
			setupMock: func() {
				mock.ExpectQuery(`INSERT INTO categories`).
					WithArgs("slug-test", "Label", "desc", 1, now, now, "pending", sqlmock.AnyArg()).
					WillReturnError(errors.New("connection lost"))
			},
			wantErr: errors.New("failed to insert category"),
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			tc.setupMock()

			cat := category.Category{
				Slug:        "slug-test",
				Label:       "Label",
				Description: "desc",
				CreatedBy:   1,
				CreatedAt:   now,
				UpdatedAt:   now,
				Status:      "pending",
				Meta:        nil,
			}

			err := r.Insert(context.Background(), cat)

			if tc.wantErr == nil && err != nil {
				t.Fatalf("expected no error, got %v", err)
			}

			if tc.wantErr != nil && err == nil {
				t.Fatalf("expected error %v, got nil", tc.wantErr)
			}

			if tc.wantErr != nil && err != nil && !errors.Is(err, tc.wantErr) {
				if !strings.Contains(err.Error(), tc.wantErr.Error()) {
					t.Errorf("expected error %v, got %v", tc.wantErr, err)
				}
			}

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("unmet sqlmock expectations: %v", err)
			}
		})
	}
}
