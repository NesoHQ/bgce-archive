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

func (handlers *Handlers) DeleteCategoryByID(w http.ResponseWriter, r *http.Request) {
	categoryUUID, err := uuid.Parse(r.PathValue("category_id"))
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid UUID", nil)
		return
	}

	err = handlers.CtgrySvc.DeleteCategory(r.Context(), category.GetCategoryFilter{
		UUID: &categoryUUID,
	})

	switch {
	case errors.Is(err, customerrors.ErrCategoryNotFound):
		utils.SendError(w, http.StatusNotFound, customerrors.ErrCategoryNotFound.Error(), nil)

	case errors.Is(err, customerrors.ErrCategoryAlreadyDeleted):
		utils.SendError(w, http.StatusOK, customerrors.ErrCategoryAlreadyDeleted.Error(), nil)

	case err != nil:
		slog.ErrorContext(
			r.Context(),
			"Failed to delete the category",
			slog.Any("error", err),
		)
		utils.SendError(w, http.StatusInternalServerError, "Internal server error", nil)

	default:
		utils.SendJson(w, http.StatusAccepted, map[string]any{
			"data":    nil,
			"message": "Category deleted successfully",
			"status":  true,
		})
	}
}
