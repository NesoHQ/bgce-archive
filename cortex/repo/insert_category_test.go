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

	"cortex/category"
	"cortex/repo"
	mock_repo "cortex/repo/mock"
)

func TestInsertCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	defer db.Close()

	writeDB := sqlx.NewDb(db, "sqlmock")

	ctgryRepo := repo.NewCtgryRepo(nil, writeDB, sq.StatementBuilder.PlaceholderFormat(sq.Dollar))

	now := time.Now()

	for _, tc := range mock_repo.InsertCategoryTestData(now, mock) {
		t.Run(tc.Name, func(t *testing.T) {
			tc.SetupMock()

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

			err := ctgryRepo.Insert(context.Background(), cat)

			if tc.WantErr == nil && err != nil {
				t.Fatalf("expected no error, got %v", err)
			}

			if tc.WantErr != nil && err == nil {
				t.Fatalf("expected error %v, got nil", tc.WantErr)
			}

			if tc.WantErr != nil && err != nil && !errors.Is(err, tc.WantErr) {
				if !strings.Contains(err.Error(), tc.WantErr.Error()) {
					t.Errorf("expected error %v, got %v", tc.WantErr, err)
				}
			}

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("unmet sqlmock expectations: %v", err)
			}
		})
	}
}
