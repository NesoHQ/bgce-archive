package handlers_test

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/mock"

	"cortex/rest/handlers"
	mock_handler "cortex/rest/handlers/mock"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
)

func TestCreateCategory(t *testing.T) {
	utils.InitValidator()
	mockSvc := new(mock_handler.CategoryService)

	h := &handlers.Handlers{
		CtgrySvc: mockSvc,
	}

	for _, tc := range mock_handler.CreateCategoryTestData() {
		t.Run(tc.Name, func(t *testing.T) {
			mockSvc.ExpectedCalls = nil

			if tc.MockReturnErr != nil || (tc.WantStatusCode == 200 || tc.WantStatusCode == 409 || tc.WantStatusCode == 500) {
				mockSvc.On("CreateCategory", mock.Anything, mock.Anything).Return(tc.MockReturnErr).Once()
			}

			req := httptest.NewRequest(http.MethodPost, "/api/v1/categories", strings.NewReader(tc.RequestBody))
			req = injectUserID(req, 1) 

			w := httptest.NewRecorder()
			h.CreateCategory(w, req)

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

			mockSvc.AssertExpectations(t)
		})
	}
}

func injectUserID(r *http.Request, userID int) *http.Request {
	ctx := context.WithValue(r.Context(), middlewares.UserIdKey, userID)
	return r.WithContext(ctx)
}
