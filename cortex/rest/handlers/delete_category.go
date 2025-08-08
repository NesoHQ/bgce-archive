package handlers

import (
	"log/slog"
	"net/http"

	"cortex/logger"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (handlers *Handlers) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	categoryUUIDStr := r.PathValue("id")
	categoryUUID, err := uuid.Parse(categoryUUIDStr)
	if err != nil {
		slog.ErrorContext(
			r.Context(),
			"Failed to parse uuid",
			logger.Extra(map[string]any{
				"error": err.Error(),
			}),
		)

		utils.SendError(w, http.StatusBadRequest, "Failed to parse", nil)
		return
	}

	err = handlers.CtgrySvc.DeleteCategory(r.Context(), categoryUUID)
	if err != nil {
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

	utils.SendJson(w, http.StatusNoContent, map[string]any{
		"data":    nil,
		"message": "Category deleted successfully",
		"status":  true,
	})
}
