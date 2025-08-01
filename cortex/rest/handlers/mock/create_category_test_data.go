package mock_handler

import (
	"errors"
	"net/http"

	customerrors "cortex/pkg/custom_errors"
)

type CreateCategory struct {
	Name           string
	RequestBody    string
	MockReturnErr  error
	WantStatusCode int
	WantResponse   string
}

func CreateCategoryTestData() []CreateCategory {
	return []CreateCategory{
		{
			Name:           "success",
			RequestBody:    `{"slug":"test-slug","label":"Test Label","description":"desc","created_by":1}`,
			MockReturnErr:  nil,
			WantStatusCode: http.StatusOK,
			WantResponse:   `"status":true`,
		},
		{
			Name:           "invalid json",
			RequestBody:    `{"slug": "missing end quote}`,
			WantStatusCode: http.StatusBadRequest,
			WantResponse:   "Failed to decode request body",
		},
		{
			Name:           "validation error",
			RequestBody:    `{"slug":"","label":"","created_by":0}`,
			WantStatusCode: http.StatusBadRequest,
			WantResponse:   "Invalid Request",
		},
		{
			Name:           "slug exists conflict",
			RequestBody:    `{"slug":"exists-slug","label":"Test Label","created_by":1}`,
			MockReturnErr:  customerrors.ErrSlugExists,
			WantStatusCode: http.StatusConflict,
			WantResponse:   "Category with the slug already exists",
		},
		{
			Name:           "internal server error",
			RequestBody:    `{"slug":"some-slug","label":"Test Label","created_by":1}`,
			MockReturnErr:  errors.New("some internal error"),
			WantStatusCode: http.StatusInternalServerError,
			WantResponse:   "Internal server error",
		},
	}
}
