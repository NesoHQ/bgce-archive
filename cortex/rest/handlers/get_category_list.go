package handlers

import (
	"net/http"
	"strconv"

	"cortex/category"
	"cortex/rest/utils"

	"github.com/google/uuid"
)

func (h *Handlers) GetCategoryList(w http.ResponseWriter, r *http.Request) {
	filter := category.GetCategoryFilter{}
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

	categories, err := h.CategoryService.GetCategoryList(r.Context(), filter)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to retrieve categories", err)
		return
	}

	response := SuccessResponse{
		Message: "Categories retrieved successfully",
		Data:    categories,
		Status:  true,
	}

	utils.SendJson(w, http.StatusOK, response)
}

func parseIntPointer(s string) *int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return nil
	}
	return &i
}

func parseUUIDPointer(s string) *uuid.UUID {
	u, err := uuid.Parse(s)
	if err != nil {
		return nil
	}
	return &u
}
