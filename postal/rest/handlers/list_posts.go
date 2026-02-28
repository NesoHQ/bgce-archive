package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"postal/domain"
	"postal/post"
)

func (h *Handlers) ListPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := r.URL.Query()

	handlerStart := time.Now()

	// Build filter
	filter := post.PostFilter{
		Limit:     20,
		Offset:    0,
		SortBy:    "order_no",
		SortOrder: "ASC",
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

	if subCategoryID := query.Get("sub_category_id"); subCategoryID != "" {
		if scid, err := strconv.ParseUint(subCategoryID, 10, 32); err == nil {
			id := uint(scid)
			filter.SubCategoryID = &id
		}
	}

	if isFeatured := query.Get("is_featured"); isFeatured != "" {
		if featured, err := strconv.ParseBool(isFeatured); err == nil {
			filter.IsFeatured = &featured
		}
	}

	if isPinned := query.Get("is_pinned"); isPinned != "" {
		if pinned, err := strconv.ParseBool(isPinned); err == nil {
			filter.IsPinned = &pinned
		}
	}

	if isPublic := query.Get("is_public"); isPublic != "" {
		if public, err := strconv.ParseBool(isPublic); err == nil {
			filter.IsPublic = &public
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

	serviceStart := time.Now()
	posts, total, err := h.PostService.ListPosts(ctx, filter)
	serviceTime := time.Since(serviceStart)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to retrieve posts",
			Error:   err.Error(),
		})
		return
	}

	encodeStart := time.Now()
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
	encodeTime := time.Since(encodeStart)

	log.Printf("ListPosts timing: service=%v, encode=%v, total=%v", serviceTime, encodeTime, time.Since(handlerStart))
}
