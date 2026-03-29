package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"community/comment"
	"community/domain"
	"community/rest/utils"
)

func (h *Handlers) ListComments(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := r.URL.Query()

	filter := comment.CommentFilter{
		Limit:     utils.DefaultLimit,
		Offset:    0,
		SortBy:    "created_at",
		SortOrder: "DESC",
	}

	if limit := query.Get("limit"); limit != "" {
		l, err := strconv.Atoi(limit)
		if err != nil || l < 1 {
			utils.SendValidationError(w, "limit must be a positive integer")
			return
		}
		filter.Limit = utils.ClampLimit(l)
	} else {
		filter.Limit = utils.DefaultLimit
	}

	if offset := query.Get("offset"); offset != "" {
		o, err := strconv.Atoi(offset)
		if err != nil || o < 0 {
			utils.SendValidationError(w, "offset must be a non-negative integer")
			return
		}
		filter.Offset = utils.ClampOffset(o)
	}

	if postID := query.Get("post_id"); postID != "" {
		if pid, err := strconv.ParseUint(postID, 10, 32); err == nil {
			id := uint(pid)
			filter.PostID = &id
		}
	}

	if status := query.Get("status"); status != "" {
		s := domain.CommentStatus(status)
		if !utils.ValidCommentStatus(s) {
			utils.SendValidationError(w, "status must be one of: pending, approved, rejected, spam")
			return
		}
		filter.Status = &s
	}

	if sortBy := query.Get("sort_by"); sortBy != "" {
		if !utils.ValidCommentSortBy(sortBy) {
			utils.SendValidationError(w, "sort_by must be one of: created_at, updated_at, like_count, reply_count")
			return
		}
		filter.SortBy = sortBy
	}

	if sortOrder := query.Get("sort_order"); sortOrder != "" {
		if !utils.ValidSortOrder(sortOrder) {
			utils.SendValidationError(w, "sort_order must be one of: asc, desc")
			return
		}
		filter.SortOrder = sortOrder
	}

	comments, total, err := h.CommentService.ListComments(ctx, filter)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to retrieve comments",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(PaginatedResponse{
		Status:  true,
		Message: "Comments retrieved successfully",
		Data:    comments,
		Meta: MetaData{
			Total:  total,
			Limit:  filter.Limit,
			Offset: filter.Offset,
		},
	})
}
