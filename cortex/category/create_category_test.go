package category_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"

	"cortex/category"
	mock_category "cortex/category/mock"
)

func TestCreateCategory(t *testing.T) {
	mockRepo := new(mock_category.CategoryRepo)
	svc := category.NewService(nil, nil, mockRepo)

	for _, tc := range mock_category.CreateCategoryTestData(t, mockRepo) {
		t.Run(tc.Name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil
			tc.MockSetup()

			err := svc.CreateCategory(context.Background(), tc.Model)

			if tc.ExpectedError == nil {
				assert.NoError(t, err)
			} else {
				assert.EqualError(t, err, tc.ExpectedError.Error())
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
