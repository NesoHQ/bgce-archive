package handlers

import (
	"log/slog"
	"net/http"

	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (handlers *Handlers) DeleteCategoryByID(w http.ResponseWriter, r *http.Request) {
	category_uuid, err := uuid.Parse(r.PathValue("category_id"))
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid UUID", nil)
		return
	}
	if err := handlers.CategoryService.DeleteCategoryByUUID(r.Context(), category_uuid); err != nil {
		slog.Error("handler: category deletation failed", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "failed to delete category", err)
		return
	}
	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Message: "Category deleted successfully",
		Status:  true,
	})
}
