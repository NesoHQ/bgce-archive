package handlers

import (
	"net/http"
	"strconv"

	customerrors "cortex/pkg/custom_errors"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (h *Handlers) GetSubCategoryByID(w http.ResponseWriter, r *http.Request) {
	// Get ID from URL path
	idStr := r.PathValue("id")
	if idStr == "" {
		utils.SendError(w, http.StatusBadRequest, "subcategory ID is required in URL", nil)
		return
	}

	// Try to parse as UUID first, then as integer
	var subcategoryUUID uuid.UUID
	var err error

	// Check if it's a UUID
	if subcategoryUUID, err = uuid.Parse(idStr); err != nil {
		// If not a UUID, try to parse as integer and find by ID
		id, parseErr := strconv.Atoi(idStr)
		if parseErr != nil {
			utils.SendError(w, http.StatusBadRequest, "invalid subcategory ID format", nil)
			return
		}

		// Find by integer ID
		subcategory, err := h.SubcategoryService.GetSubcategoryByID(r.Context(), id)
		if err != nil {
			utils.SendError(w, http.StatusNotFound, "subcategory not found", nil)
			return
		}

		// Check if it's actually a subcategory (has a parent)
		if subcategory.ParentID == 0 {
			utils.SendError(w, http.StatusBadRequest, "category is not a subcategory", nil)
			return
		}

		response := SuccessResponse{
			Message: "Subcategory retrieved successfully",
			Data:    subcategory,
			Status:  http.StatusOK,
		}

		utils.SendJson(w, http.StatusOK, response)
		return
	}

	// Find by UUID
	subcategory, err := h.SubcategoryService.GetSubcategoryByUUID(r.Context(), subcategoryUUID)
	if err != nil {
		if err == customerrors.ErrCategoryNotFound {
			utils.SendError(w, http.StatusNotFound, "subcategory not found", nil)
			return
		}
		utils.SendError(w, http.StatusInternalServerError, "failed to retrieve subcategory", err)
		return
	}

	// Check if it's actually a subcategory (has a parent)
	if subcategory.ParentID == 0 {
		utils.SendError(w, http.StatusBadRequest, "category is not a subcategory", nil)
		return
	}

	response := SuccessResponse{
		Message: "Subcategory retrieved successfully",
		Data:    subcategory,
		Status:  http.StatusOK,
	}

	utils.SendJson(w, http.StatusOK, response)
}
