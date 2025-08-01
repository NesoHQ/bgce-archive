package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"cortex/category"
	"cortex/logger"
	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/utils"
)

type CreateCategoryReq struct {
	Slug        string          `json:"slug" validate:"required"`
	Label       string          `json:"label" validate:"required"`
	Description string          `json:"description,omitempty"`
	CreatedBy   uint            `json:"created_by" validate:"required"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}

func (handlers *Handlers) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req CreateCategoryReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		slog.ErrorContext(
			r.Context(),
			"Failed to decode request body",
			logger.Extra(map[string]any{
				"error": err.Error(),
			}),
		)

		utils.SendError(w, http.StatusBadRequest, "Failed to decode request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		slog.ErrorContext(
			r.Context(),
			"Invalid Query Params",
			logger.Extra(map[string]any{
				"error": err.Error(),
			}),
		)

		utils.SendError(w, http.StatusBadRequest, "Invalid Request", nil)
		return
	}

	ctgry := category.CreateCategoryModel{
		Slug:        req.Slug,
		Label:       req.Label,
		Description: req.Description,
		CreatedBy:   req.CreatedBy,
		Meta:        req.Meta,
	}

	err := handlers.CtgrySvc.CreateCategory(r.Context(), ctgry)
	if err != nil {
		if err == customerrors.ErrSlugExists {
			slog.ErrorContext(
				r.Context(),
				"Category slug already exists",
				logger.Extra(map[string]any{
					"error": err.Error(),
				}),
			)
			utils.SendError(w, http.StatusConflict, "Category with the slug already exists", nil)
			return
		}
		slog.ErrorContext(
			r.Context(),
			"Failed to create the category",
			logger.Extra(map[string]any{
				"error": err.Error(),
			}),
		)
		utils.SendError(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, map[string]any{
		"data":    nil,
		"message": "Category created successfully",
		"status":  true,
	})
}
