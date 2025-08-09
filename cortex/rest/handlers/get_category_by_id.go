package handlers

import (
	"fmt"
	"log/slog"
	"net/http"

	"cortex/logger"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (handlers *Handlers) GetCategoryByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("router hit", r.PathValue("id"))

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
		utils.SendError(w, http.StatusBadRequest, "Invalid category UUID", nil)
		return
	}

	cat, err := handlers.CtgrySvc.GetCategoryByID(r.Context(), categoryUUID)
	if err != nil {
		slog.ErrorContext(
			r.Context(),
			"Failed to get the category",
			logger.Extra(map[string]any{
				"error": err.Error(),
			}),
		)
		utils.SendError(w, http.StatusNotFound, "Category not found.", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, map[string]any{
		"data":    cat,
		"message": "Category found successfully",
		"status":  true,
	})
}
