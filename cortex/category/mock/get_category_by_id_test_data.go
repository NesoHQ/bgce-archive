package mock_category

import (
	"errors"
	"time"

	"cortex/category"

	"github.com/google/uuid"
)

type GetCategoryByIDTestCase struct {
	Name             string
	CategoryUUID     string
	ExpectedCategory *category.Category
	ExpectedError    error
	WantStatusCode   int
	WantResponse     string
}

func GetCategoryByIDTestData() []GetCategoryByIDTestCase {
	validUUID := uuid.New()
	invalidUUID := "invalid-uuid"
	notFoundUUID := uuid.New()

	return []GetCategoryByIDTestCase{
		{
			Name:         "Valid UUID - Category Found",
			CategoryUUID: validUUID.String(),
			ExpectedCategory: &category.Category{
				ID:          1,
				UUID:        validUUID,
				Slug:        "test-category",
				Label:       "Test Category",
				Description: "Test Description",
				CreatedBy:   1,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
				Status:      category.StatusPending,
			},
			ExpectedError: nil,
		},
		{
			Name:             "Invalid UUID Format",
			CategoryUUID:     invalidUUID,
			ExpectedCategory: nil,
			ExpectedError:    errors.New("invalid UUID"),
		},
		{
			Name:             "Category Not Found",
			CategoryUUID:     notFoundUUID.String(),
			ExpectedCategory: nil,
			ExpectedError:    errors.New("category not found"),
		},
		{
			Name:             "Database Error",
			CategoryUUID:     validUUID.String(),
			ExpectedCategory: nil,
			ExpectedError:    errors.New("database connection failed"),
		},
	}
}
