package handlers

import (
	"errors"
	"log/slog"
	"net/http"

	"cortex/category"
	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (handlers *Handlers) GetCategoryByID(w http.ResponseWriter, r *http.Request) {
	categoryUUID, err := uuid.Parse(r.PathValue("category_id"))
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid UUID", nil)
		return
	}

	category, err := handlers.CtgrySvc.GetCategory(r.Context(), category.GetCategoryFilter{
		UUID: &categoryUUID,
	})
	if errors.Is(err, customerrors.ErrCategoryNotFound) {
		utils.SendError(w, http.StatusNotFound, customerrors.ErrCategoryNotFound.Error(), nil)
		return
	} else if err != nil {
		slog.ErrorContext(
			r.Context(),
			"Failed to fetch the category",
			slog.Any("error", err),
		)
		utils.SendError(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, map[string]any{
		"data":    category,
		"message": "Category fetched successfully",
		"status":  true,
	})
}
