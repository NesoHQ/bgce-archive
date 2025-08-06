package mock_category

import (
	"errors"

	"github.com/google/uuid"
)

type DeleteCategory struct {
	Name          string
	ID            string
	ExpectedError error
}

func DeleteCategoryTestData() []DeleteCategory {
	return []DeleteCategory{
		{
			Name:          "success",
			ID:            uuid.NewString(),
			ExpectedError: nil,
		},
		{
			Name:          "delete failure",
			ID:            uuid.NewString(),
			ExpectedError: errors.New("delete failed"),
		},
	}
}
