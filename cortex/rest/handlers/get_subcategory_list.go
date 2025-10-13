package handlers

import (
	"net/http"

	"cortex/subcategory"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (h *Handlers) GetSubCategoryList(w http.ResponseWriter, r *http.Request) {
	// Get parent UUID from query parameter
	parentUUIDStr := r.URL.Query().Get("parent_uuid")
	if parentUUIDStr == "" {
		utils.SendError(w, http.StatusBadRequest, "parent_uuid query parameter is required", nil)
		return
	}

	parentUUID, err := uuid.Parse(parentUUIDStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid parent_uuid format", nil)
		return
	}

	// Build filter from query parameters
	filter := subcategory.GetSubcategoryFilter{}
	if limit := r.URL.Query().Get("limit"); limit != "" {
		filter.Limit = parseIntPointer(limit)
	}
	if offset := r.URL.Query().Get("offset"); offset != "" {
		filter.Offset = parseIntPointer(offset)
	}
	if sortBy := r.URL.Query().Get("sort_by"); sortBy != "" {
		filter.SortBy = &sortBy
	}
	if sortOrder := r.URL.Query().Get("sort_order"); sortOrder != "" {
		filter.SortOrder = &sortOrder
	}
	if status := r.URL.Query().Get("status"); status != "" {
		filter.Status = &status
	}
	if id := r.URL.Query().Get("id"); id != "" {
		filter.ID = parseIntPointer(id)
	}
	if uuid := r.URL.Query().Get("uuid"); uuid != "" {
		filter.UUID = parseUUIDPointer(uuid)
	}
	if slug := r.URL.Query().Get("slug"); slug != "" {
		filter.Slug = &slug
	}
	if label := r.URL.Query().Get("label"); label != "" {
		filter.Label = &label
	}

	subcategories, err := h.SubcategoryService.GetSubcategoriesByParentID(r.Context(), parentUUID, filter)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to retrieve subcategories", err)
		return
	}

	response := SuccessResponse{
		Message: "Subcategories retrieved successfully",
		Data:    subcategories,
		Status:  http.StatusOK,
	}

	utils.SendJson(w, http.StatusOK, response)
}
