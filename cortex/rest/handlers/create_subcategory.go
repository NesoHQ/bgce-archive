package handlers

import (
	"encoding/json"
	"net/http"

	"cortex/subcategory"
	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
)

type CreateSubcategoryRequest struct {
	Slug        string `json:"slug" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Description string `json:"description,omitempty"`
	ParentUUID  string `json:"parent_uuid" validate:"required"`
}

func (h *Handlers) CreateSubcategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req CreateSubcategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to decode request body", nil)
		return
	}

	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	subcategoryParams := subcategory.CreateSubcategoryParams{
		Slug:        req.Slug,
		Label:       req.Name,
		Description: req.Description,
		CreatorID:   userID,
		ParentUUID:  req.ParentUUID,
		Meta:        make(map[string]interface{}),
	}

	err := h.SubcategoryService.CreateSubcategory(ctx, subcategoryParams)
	if err != nil {
		if err == customerrors.ErrSlugExists {
			utils.SendError(w, http.StatusConflict, "Subcategory with this slug already exists", nil)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Failed to create subcategory", nil)
		return
	}

	utils.SendJson(w, http.StatusCreated, SuccessResponse{
		Message: "Subcategory created successfully",
		Status:  http.StatusCreated,
		Data:    nil,
	})
}
