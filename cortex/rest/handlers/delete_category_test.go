package handlers_test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/mock"

	"cortex/rest/handlers"
	mock_handler "cortex/rest/handlers/mock"
)

func TestDeleteCategory(t *testing.T) {
	mockSvc := new(mock_handler.CategoryService)

	h := &handlers.Handlers{
		CtgrySvc: mockSvc,
	}

	for _, tc := range mock_handler.DeleteCategoryTestData() {
		t.Run(tc.Name, func(t *testing.T) {
			mockSvc.ExpectedCalls = nil

			if tc.WantStatusCode != http.StatusBadRequest {
				mockSvc.On("DeleteCategory", mock.Anything, tc.ID).Return(tc.MockReturnErr).Once()
			}

			url := fmt.Sprintf("/api/v1/categories/%v", tc.ID)
			req := httptest.NewRequest(http.MethodDelete, url, nil)
			req.SetPathValue("id", tc.ID)

			w := httptest.NewRecorder()
			h.DeleteCategory(w, req)

			resp := w.Result()
			defer resp.Body.Close()

			if resp.StatusCode != tc.WantStatusCode {
				t.Errorf("expected status %d, got %d", tc.WantStatusCode, resp.StatusCode)
			}
			mockSvc.AssertExpectations(t)
		})
	}
}
