package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"cortex/category"
	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
	// or chi if you’re using that
)

type UpdateCategoryReq struct {
	NewSlug     string          `json:"new_slug,omitempty"`
	Label       string          `json:"label,omitempty"`
	Description string          `json:"description,omitempty"`
	ApprovedAt  *time.Time      `json:"approved_at,omitempty"`
	Status      string          `json:"status,omitempty"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}

func (h *Handlers) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusBadRequest, "Bad request", nil)
		return
	}

	// Grab the slug from the URL instead of UUID
	slug := r.PathValue("slug") // or chi.URLParam(r, "slug") if using chi
	if slug == "" {
		utils.SendError(w, http.StatusBadRequest, "slug is required in URL", nil)
		return
	}

	var req UpdateCategoryReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to decode request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	// Prepare update params
	updateParams := category.UpdateCategoryParams{
		Slug:      &slug,
		UpdatedBy: userID,
	}

	// Only set fields that are provided
	if req.NewSlug != "" {
		updateParams.NewSlug = &req.NewSlug
	}
	if req.Label != "" {
		updateParams.Label = &req.Label
	}
	if req.Description != "" {
		updateParams.Description = &req.Description
	}
	if req.Status != "" {
		updateParams.Status = &req.Status
		// Only set approval fields if status is being changed to approved
		if req.Status == "approved" {
			updateParams.ApprovedBy = userID
			updateParams.ApprovedAt = time.Now()
		}
	}
	if req.Meta != nil {
		updateParams.Meta = req.Meta
	}

	err := h.CategoryService.UpdateCategory(r.Context(), updateParams)
	if err != nil {
		switch err {
		case customerrors.ErrCategoryNotFound:
			utils.SendError(w, http.StatusNotFound, "Category not found", nil)
		case customerrors.ErrSlugExists:
			utils.SendError(w, http.StatusConflict, "Category with this slug already exists", nil)
		default:
			utils.SendError(w, http.StatusInternalServerError, "Internal server error", nil)
		}
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    nil,
		Message: "Category updated successfully",
		Status:  true,
	})
}
