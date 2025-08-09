package handlers_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"

	mock_category "cortex/category/mock"
	"cortex/rest/handlers"
	mock_handler "cortex/rest/handlers/mock"
)

func TestGetCategoryByID(t *testing.T) {
	mockSvc := new(mock_handler.CategoryService)

	h := &handlers.Handlers{
		CtgrySvc: mockSvc,
	}

	for _, tc := range mock_category.GetCategoryByIDTestData() {
		t.Run(tc.Name, func(t *testing.T) {
			mockSvc.ExpectedCalls = nil

			if parsedUUID, err := uuid.Parse(tc.CategoryUUID); err == nil {
				mockSvc.On("GetCategoryByID", mock.Anything, parsedUUID).
					Return(tc.ExpectedCategory, tc.ExpectedError).
					Once()
			}

			req := httptest.NewRequest(http.MethodGet, "/api/v1/categories/"+tc.CategoryUUID, nil)
			req.SetPathValue("id", tc.CategoryUUID)

			w := httptest.NewRecorder()
			h.GetCategoryByID(w, req)

			resp := w.Result()
			defer resp.Body.Close()

			if resp.StatusCode != tc.WantStatusCode {
				t.Errorf("expected status %d, got %d", tc.WantStatusCode, resp.StatusCode)
			}

			var bodyBytes bytes.Buffer
			_, err := bodyBytes.ReadFrom(resp.Body)
			if err != nil {
				t.Fatalf("failed to read response body: %v", err)
			}

			bodyStr := bodyBytes.String()
			if !strings.Contains(bodyStr, tc.WantResponse) {
				t.Errorf("expected response to contain %q, got %q", tc.WantResponse, bodyStr)
			}

			if _, err := uuid.Parse(tc.CategoryUUID); err == nil {
				mockSvc.AssertExpectations(t)
			}
		})
	}
}
