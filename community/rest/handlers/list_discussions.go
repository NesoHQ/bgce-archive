package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"community/discussion"
	"community/domain"
	"community/rest/utils"
)

func (h *Handlers) ListDiscussions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := r.URL.Query()

	filter := discussion.DiscussionFilter{
		Limit:  utils.DefaultLimit,
		Offset: 0,
		Sort:   "recent",
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

	if categoryID := query.Get("category_id"); categoryID != "" {
		if cid, err := strconv.ParseUint(categoryID, 10, 32); err == nil {
			id := uint(cid)
			filter.CategoryID = &id
		}
	}

	if status := query.Get("status"); status != "" {
		s := domain.DiscussionStatus(status)
		if !utils.ValidDiscussionStatus(s) {
			utils.SendValidationError(w, "status must be one of: open, closed, locked")
			return
		}
		filter.Status = &s
	}

	if sort := query.Get("sort"); sort != "" {
		if !utils.ValidDiscussionSort(sort) {
			utils.SendValidationError(w, "sort must be one of: recent, popular, unanswered")
			return
		}
		filter.Sort = sort
	}

	discussions, total, err := h.DiscussionService.ListDiscussions(ctx, filter)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to retrieve discussions",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(PaginatedResponse{
		Status:  true,
		Message: "Discussions retrieved successfully",
		Data:    discussions,
		Meta: MetaData{
			Total:  total,
			Limit:  filter.Limit,
			Offset: filter.Offset,
		},
	})
}
