package category_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"cortex/category"
	mock_category "cortex/category/mock"
)

func TestGetCategoryByID(t *testing.T) {
	mockRepo := new(mock_category.CategoryRepo)
	svc := category.NewService(nil, nil, mockRepo)

	for _, tc := range mock_category.GetCategoryByIDTestData() {
		t.Run(tc.Name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil

			// Handle invalid UUID case separately
			parsedUUID, err := uuid.Parse(tc.CategoryUUID)
			if err != nil {
				// সার্ভিসে পাঠানোর আগে invalid UUID এরর সরাসরি টেস্ট করো
				_, svcErr := svc.GetCategoryByID(context.Background(), uuid.Nil)
				assert.Error(t, svcErr)
				return
			}

			// Mock setup
			mockRepo.On("GetCategoryByID", mock.Anything, parsedUUID).
				Return(tc.ExpectedCategory, tc.ExpectedError)

			// Call the service
			result, svcErr := svc.GetCategoryByID(context.Background(), parsedUUID)

			if tc.ExpectedError == nil {
				assert.NoError(t, svcErr)
				assert.NotNil(t, result)
				if tc.ExpectedCategory != nil {
					assert.Equal(t, tc.ExpectedCategory.UUID, result.UUID)
					assert.Equal(t, tc.ExpectedCategory.Label, result.Label)
				}
			} else {
				assert.Error(t, svcErr)
				assert.Nil(t, result)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
