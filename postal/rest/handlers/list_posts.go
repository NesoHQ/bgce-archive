package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"postal/domain"
	"postal/post"
)

func (h *Handlers) ListPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := r.URL.Query()

	// Build filter
	filter := post.PostFilter{
		Limit:     20,
		Offset:    0,
		SortBy:    "created_at",
		SortOrder: "DESC",
	}

	if limit := query.Get("limit"); limit != "" {
		if l, err := strconv.Atoi(limit); err == nil {
			filter.Limit = l
		}
	}

	if offset := query.Get("offset"); offset != "" {
		if o, err := strconv.Atoi(offset); err == nil {
			filter.Offset = o
		}
	}

	if status := query.Get("status"); status != "" {
		s := domain.PostStatus(status)
		filter.Status = &s
	}

	if categoryID := query.Get("category_id"); categoryID != "" {
		if cid, err := strconv.ParseUint(categoryID, 10, 32); err == nil {
			id := uint(cid)
			filter.CategoryID = &id
		}
	}

	if search := query.Get("search"); search != "" {
		filter.Search = &search
	}

	if sortBy := query.Get("sort_by"); sortBy != "" {
		filter.SortBy = sortBy
	}

	if sortOrder := query.Get("sort_order"); sortOrder != "" {
		filter.SortOrder = sortOrder
	}

	posts, total, err := h.PostService.ListPosts(ctx, filter)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to retrieve posts",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(PaginatedResponse{
		Status:  true,
		Message: "Posts retrieved successfully",
		Data:    posts,
		Meta: MetaData{
			Total:  total,
			Limit:  filter.Limit,
			Offset: filter.Offset,
		},
	})
}
