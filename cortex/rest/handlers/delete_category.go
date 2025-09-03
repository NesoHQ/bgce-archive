package handlers

import (
	"log/slog"
	"net/http"

	"cortex/logger"
	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (handlers *Handlers) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	categoryUUID := r.PathValue("id")

	if categoryUUID == "" {
		utils.SendError(w, http.StatusBadRequest, "Empty category uuid", nil)
		return
	}

	_, err := uuid.Parse(categoryUUID)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "UUID format not valid", nil)
		return
	}

	err = handlers.CtgrySvc.DeleteCategory(r.Context(), categoryUUID)
	if err == customerrors.ErrCategoryNotFound {
		utils.SendError(w, http.StatusNotFound, customerrors.ErrCategoryNotFound.Error(), nil)
		return
	} else if err == customerrors.ErrCategoryAlreadyDeleted {
		utils.SendError(w, http.StatusConflict, customerrors.ErrCategoryAlreadyDeleted.Error(), nil)
		return
	} else if err != nil {
		slog.ErrorContext(
			r.Context(),
			"Failed to delete the category",
			logger.Extra(map[string]any{
				"error": err.Error(),
			}),
		)
		utils.SendError(w, http.StatusInternalServerError, "Internal server error", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, map[string]any{
		"data":    nil,
		"message": "Category deleted successfully",
		"status":  true,
	})
}
