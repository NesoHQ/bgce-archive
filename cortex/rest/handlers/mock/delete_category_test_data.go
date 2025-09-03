package mock_handler

import (
	"errors"
	"net/http"

	customerrors "cortex/pkg/custom_errors"

	"github.com/google/uuid"
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
			ID:             uuid.NewString(),
			MockReturnErr:  nil,
			WantStatusCode: http.StatusOK,
		},
		{
			Name:           "empty uuid",
			ID:             "",
			MockReturnErr:  nil,
			WantStatusCode: http.StatusBadRequest,
		},
		{
			Name:           "invalid uuid",
			ID:             "xyz",
			MockReturnErr:  nil,
			WantStatusCode: http.StatusBadRequest,
		},
		{
			Name:           "category not found",
			ID:             uuid.NewString(),
			MockReturnErr:  customerrors.ErrCategoryNotFound,
			WantStatusCode: http.StatusNotFound,
		},
		{
			Name:           "category deleted conflict",
			ID:             uuid.NewString(),
			MockReturnErr:  customerrors.ErrCategoryAlreadyDeleted,
			WantStatusCode: http.StatusConflict,
		},
		{
			Name:           "internal server error",
			ID:             uuid.NewString(),
			MockReturnErr:  errors.New("internal server error"),
			WantStatusCode: http.StatusInternalServerError,
		},
	}
}
