package category_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"cortex/category"
	mock_category "cortex/category/mock"
)

func TestDeleteCategory(t *testing.T) {
	mockRepo := new(mock_category.CategoryRepo)
	svc := category.NewService(nil, nil, mockRepo, nil)

	for _, tc := range mock_category.DeleteCategoryTestData() {
		t.Run(tc.Name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil

			mockRepo.On("Delete", mock.Anything, tc.ID).Return(tc.ExpectedError).Once()

			err := svc.DeleteCategory(context.Background(), tc.ID)

			if tc.ExpectedError == nil {
				assert.NoError(t, err)
			} else {
				assert.EqualError(t, err, tc.ExpectedError.Error())
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
