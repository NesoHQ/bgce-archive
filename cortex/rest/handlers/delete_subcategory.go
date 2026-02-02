package handlers

import (
	"net/http"

	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/middlewares"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (h *Handlers) DeleteSubCategory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get subcategory ID from URL path
	idStr := r.PathValue("id")
	if idStr == "" {
		utils.SendError(w, http.StatusBadRequest, "subcategory ID is required in URL", nil)
		return
	}

	// Parse UUID
	subcategoryUUID, err := uuid.Parse(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid subcategory ID format", nil)
		return
	}

	// Get user ID from middleware
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Delete subcategory
	err = h.SubcategoryService.DeleteSubcategory(ctx, subcategoryUUID, userID)
	if err != nil {
		switch err {
		case customerrors.ErrCategoryNotFound:
			utils.SendError(w, http.StatusNotFound, "Subcategory not found", nil)
			return
		default:
			utils.SendError(w, http.StatusInternalServerError, "Failed to delete subcategory", err)
			return
		}
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Message: "Subcategory deleted successfully",
		Status:  true,
		Data:    nil,
	})
}
