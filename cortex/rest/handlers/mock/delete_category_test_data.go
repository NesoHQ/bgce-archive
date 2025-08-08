package mock_handler

import (
	"errors"
	"net/http"
)

type DeleteCategory struct {
	Name           string
	ID             string
	MockReturnErr  error
	WantStatusCode int
}

func DeleteCategoryTestData() []DeleteCategory {
	return []DeleteCategory{
		{
			Name:           "success",
			ID:             "1",
			MockReturnErr:  nil,
			WantStatusCode: http.StatusNoContent,
		},
		{
			Name:           "invalid id format",
			ID:             "abc",
			MockReturnErr:  errors.New("invalid id format"),
			WantStatusCode: http.StatusBadRequest,
		},
		{
			Name:           "internal server error",
			ID:             "3",
			MockReturnErr:  errors.New("some internal error"),
			WantStatusCode: http.StatusInternalServerError,
		},
	}
}
