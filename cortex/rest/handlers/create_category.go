package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"

	"cortex/category"
)

type CreateCategoryReq struct {
	Slug        string          `json:"slug"`
	Label       string          `json:"label"`
	Description string          `json:"description"`
	CreatedBy   int             `json:"created_by"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}

var categories []category.Category

func (h *Handlers) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req CreateCategoryReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	now := time.Now().UTC()
	newCat := category.Category{
		UUID:        uuid.New(),
		Slug:        req.Slug,
		Label:       req.Label,
		Description: req.Description,
		CreatedBy:   req.CreatedBy,
		CreatedAt:   now,
		UpdatedAt:   now,
		Status:      "pending",
		Meta:        req.Meta,
	}

	categories = append(categories, newCat)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newCat)
}

func init() {
	now := time.Now().UTC()
	adminID := 1
	categories = append(categories, category.Category{
		ID:          1,
		UUID:        uuid.MustParse("1b3e45a1-8b2a-45b5-9b88-7c2a2b3e8888"),
		Slug:        "interview-qna",
		Label:       "Interview Q&A",
		Description: "Technical interview questions categorized by difficulty and topic",
		CreatedBy:   adminID,
		CreatedAt:   now.Add(-48 * time.Hour),
		UpdatedAt:   now.Add(-24 * time.Hour),
		Status:      "approved",
		Meta:        json.RawMessage(`{"level":"intermediate","topics":["golang","sql"]}`),
	})
}
