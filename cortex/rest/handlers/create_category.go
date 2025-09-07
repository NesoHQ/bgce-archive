package handlers

import (
	"encoding/json"
	"net/http"

	"cortex/category"
	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
)

type CreateCategoryReq struct {
	Slug        string                 `json:"slug" validate:"required"`
	Label       string                 `json:"label" validate:"required"`
	Description string                 `json:"description,omitempty"`
	Meta        map[string]interface{} `json:"meta,omitempty"`
}

func (handlers *Handlers) CreateCategory(w http.ResponseWriter, r *http.Request) {
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusBadRequest, "Bad request", nil)
		return
	}

	var req CreateCategoryReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to decode request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid Request", nil)
		return
	}

	ctgry := category.CreateCategoryParams{
		Slug:        req.Slug,
		Label:       req.Label,
		Description: req.Description,
		CreatorID:   userID,
		Meta:        req.Meta,
	}

	err := handlers.CategoryService.CreateCategory(r.Context(), ctgry)
	if err != nil {
		if err == customerrors.ErrSlugExists {
			utils.SendError(w, http.StatusConflict, "Category with the slug already exists", nil)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    nil,
		Message: "Category created successfully",
		Status:  http.StatusCreated,
	})
}
