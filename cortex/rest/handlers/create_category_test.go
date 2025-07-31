package handlers_test

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/mock"

	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/handlers"
	"cortex/rest/utils"
)

func TestCreateCategory(t *testing.T) {
	utils.InitValidator()
	mockSvc := new(MockCategoryService)

	h := &handlers.Handlers{
		CtgrySvc: mockSvc,
	}

	tests := []struct {
		name           string
		requestBody    string
		mockReturnErr  error
		wantStatusCode int
		wantResponse   string
	}{
		{
			name:           "success",
			requestBody:    `{"slug":"test-slug","label":"Test Label","description":"desc","created_by":1}`,
			mockReturnErr:  nil,
			wantStatusCode: http.StatusOK,
			wantResponse:   `"status":true`,
		},
		{
			name:           "invalid json",
			requestBody:    `{"slug": "missing end quote}`,
			wantStatusCode: http.StatusBadRequest,
			wantResponse:   "Failed to decode request body",
		},
		{
			name:           "validation error",
			requestBody:    `{"slug":"","label":"","created_by":0}`,
			wantStatusCode: http.StatusBadRequest,
			wantResponse:   "Invalid Request",
		},
		{
			name:           "slug exists conflict",
			requestBody:    `{"slug":"exists-slug","label":"Test Label","created_by":1}`,
			mockReturnErr:  customerrors.ErrSlugExists,
			wantStatusCode: http.StatusConflict,
			wantResponse:   "Category with the slug already exists",
		},
		{
			name:           "internal server error",
			requestBody:    `{"slug":"some-slug","label":"Test Label","created_by":1}`,
			mockReturnErr:  errors.New("some internal error"),
			wantStatusCode: http.StatusInternalServerError,
			wantResponse:   "Internal server error",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			mockSvc.ExpectedCalls = nil

			mockSvc.On("CreateCategory", mock.Anything, mock.Anything).Return(tc.mockReturnErr).Once()

			req := httptest.NewRequest(http.MethodPost, "/api/v1/categories", strings.NewReader(tc.requestBody))
			w := httptest.NewRecorder()

			h.CreateCategory(w, req)

			resp := w.Result()
			defer resp.Body.Close()

			if resp.StatusCode != tc.wantStatusCode {
				t.Errorf("expected status %d, got %d", tc.wantStatusCode, resp.StatusCode)
			}

			var bodyBytes bytes.Buffer
			_, err := bodyBytes.ReadFrom(resp.Body)
			if err != nil {
				t.Fatalf("failed to read response body: %v", err)
			}

			bodyStr := bodyBytes.String()

			if !strings.Contains(bodyStr, tc.wantResponse) {
				t.Errorf("expected response to contain %q, got %q", tc.wantResponse, bodyStr)
			}

			if tc.mockReturnErr != nil {
				mockSvc.AssertExpectations(t)
			}
		})
	}
}
