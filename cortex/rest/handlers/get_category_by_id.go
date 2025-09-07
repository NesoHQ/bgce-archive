package handlers

import (
	"log/slog"
	"net/http"

	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (handlers *Handlers) GetCategoryByID(w http.ResponseWriter, r *http.Request) {
	category_uuid, err := uuid.Parse(r.PathValue("category_id"))
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid UUID", nil)
		return
	}
	cateory, err := handlers.CategoryService.FindCategoryByUUID(r.Context(), category_uuid)
	if err != nil {
		slog.Error("handler: category retrieval failed", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "failed to find category", err)
		return
	}
	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:   cateory,
		Status: http.StatusOK,
	})

}
