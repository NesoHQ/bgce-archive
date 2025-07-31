package category_test

import (
	"context"
	"encoding/json"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"cortex/category"
)

func TestCreateCategory(t *testing.T) {
	mockRepo := new(MockCategoryRepo)
	svc := category.NewService(nil, nil, mockRepo)

	metaMap := map[string]any{"foo": "bar"}
	metaJSON, err := json.Marshal(metaMap)
	if err != nil {
		t.Fatalf("failed to marshal meta json: %v", err)
	}

	baseModel := category.CreateCategoryModel{
		Slug:        "slug-test",
		Label:       "Label",
		Description: "desc",
		CreatedBy:   1,
		Meta:        metaJSON,
	}

	tests := []struct {
		name          string
		model         category.CreateCategoryModel
		mockSetup     func()
		expectedError error
	}{
		{
			name:  "success",
			model: baseModel,
			mockSetup: func() {
				mockRepo.
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
					Return(nil).
					Once()
			},
			expectedError: nil,
		},
		{
			name:  "insert failure",
			model: baseModel,
			mockSetup: func() {
				mockRepo.
					On("Insert", mock.Anything, mock.AnythingOfType("category.Category")).
					Return(errors.New("insert failed")).
					Once()
			},
			expectedError: errors.New("insert failed"),
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil 
			tc.mockSetup()

			err := svc.CreateCategory(context.Background(), tc.model)

			if tc.expectedError == nil {
				assert.NoError(t, err)
			} else {
				assert.EqualError(t, err, tc.expectedError.Error())
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
