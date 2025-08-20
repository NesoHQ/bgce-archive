package mock_category

import (
	"encoding/json"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"

	"cortex/category"
	customerrors "cortex/pkg/custom_errors"
)

type CreateCategory struct {
	Name          string
	Model         category.CreateCategoryParams
	MockSetup     func()
	ExpectedError error
}

func CreateCategoryTestData(t *testing.T, mockCategoryRepo *CategoryRepo) []CreateCategory {
	metaMap := map[string]any{"foo": "bar"}
	metaJSON, err := json.Marshal(metaMap)
	if err != nil {
		t.Fatalf("failed to marshal meta json: %v", err)
	}

	baseModel := category.CreateCategoryParams{
		Slug:        "slug-test",
		Label:       "Label",
		Description: "desc",
		CreatedBy:   1,
		Meta:        metaJSON,
	}

	demoCategory := &category.Category{
		ID:          1,
		UUID:        uuid.New(),
		Slug:        baseModel.Slug,
		Label:       baseModel.Label,
		Description: baseModel.Description,
		CreatedBy:   baseModel.CreatedBy,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Status:      category.StatusPending,
		Meta:        baseModel.Meta,
	}

	Tests := []CreateCategory{
		{
			Name:  "success",
			Model: baseModel,
			MockSetup: func() {
				mockCategoryRepo.
					On("Get", mock.Anything, mock.Anything).
					Return(nil, customerrors.ErrCategoryNotFound).
					Once()

				mockCategoryRepo.
					On("Insert", mock.Anything, mock.MatchedBy(func(c category.Category) bool {
						if c.Slug != baseModel.Slug ||
							c.Label != baseModel.Label ||
							c.Description != baseModel.Description ||
							c.CreatedBy != baseModel.CreatedBy ||
							c.Status != category.StatusPending ||
							c.CreatedAt.IsZero() ||
							c.UpdatedAt.IsZero() {
							return false
						}
						var meta map[string]interface{}
						if err := json.Unmarshal(c.Meta, &meta); err != nil {
							return false
						}
						val, ok := meta["foo"]
						return ok && val == "bar"
					})).
					Return(demoCategory, nil).
					Once()
			},
			ExpectedError: nil,
		},
		{
			Name:  "Slug already exists",
			Model: baseModel,
			MockSetup: func() {
				mockCategoryRepo.
					On("Get", mock.Anything, mock.Anything).
					Return(demoCategory, nil).
					Once()
			},
			ExpectedError: customerrors.ErrSlugExists,
		},
		{
			Name:  "insert failure",
			Model: baseModel,
			MockSetup: func() {
				mockCategoryRepo.
					On("Get", mock.Anything, mock.Anything).
					Return(nil, customerrors.ErrCategoryNotFound).
					Once()

				mockCategoryRepo.
					On("Insert", mock.Anything, mock.AnythingOfType("category.Category")).
					Return(nil, errors.New("insert failed")).
					Once()
			},
			ExpectedError: errors.New("insert failed"),
		},
	}

	return Tests
}
