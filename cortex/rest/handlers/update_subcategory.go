package handlers

import (
	"encoding/json"
	"net/http"

	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
	"cortex/subcategory"

	"github.com/google/uuid"
)

type UpdateSubcategoryRequest struct {
	Slug        string          `json:"slug,omitempty"`
	Label       string          `json:"label,omitempty"`
	Description string          `json:"description,omitempty"`
	Status      string          `json:"status,omitempty"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}

func (h *Handlers) UpdateSubCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get subcategory ID from URL path
	idStr := r.PathValue("id")
	if idStr == "" {
		utils.SendError(w, http.StatusBadRequest, "subcategory ID is required in URL", nil)
		return
	}

	// Parse UUID
	subcategoryUUID, err := uuid.Parse(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid subcategory ID format", nil)
		return
	}

	// Get user ID from middleware
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Decode request body
	var req UpdateSubcategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to decode request body", nil)
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	// Build update parameters
	updateParams := subcategory.UpdateSubcategoryParams{
		UUID:      subcategoryUUID,
		UpdatedBy: userID,
	}

	if req.Slug != "" {
		updateParams.Slug = &req.Slug
	}
	if req.Label != "" {
		updateParams.Label = &req.Label
	}
	if req.Description != "" {
		updateParams.Description = &req.Description
	}
	if req.Status != "" {
		updateParams.Status = &req.Status
	}
	if req.Meta != nil {
		updateParams.Meta = req.Meta
	}

	// Update subcategory
	err = h.SubcategoryService.UpdateSubcategory(ctx, updateParams)
	if err != nil {
		switch err {
		case customerrors.ErrCategoryNotFound:
			utils.SendError(w, http.StatusNotFound, "Subcategory not found", nil)
			return
		case customerrors.ErrSlugExists:
			utils.SendError(w, http.StatusConflict, "Subcategory with this slug already exists", nil)
			return
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to update subcategory", err)
			return
		}
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Message: "Subcategory updated successfully",
		Status:  true,
		Data:    nil,
	})
}
