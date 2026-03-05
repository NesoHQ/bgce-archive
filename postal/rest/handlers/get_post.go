package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"postal/rest/utils"
)

func (h *Handlers) GetPostByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := utils.ExtractIDFromPath(r.URL.Path)

	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Invalid post ID",
		})
		return
	}

	post, err := h.PostService.GetPostByID(ctx, uint(id))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Post not found",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post retrieved successfully",
		Data:    post,
	})
}

func (h *Handlers) GetPostBySlug(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	slug := utils.ExtractSlugFromPath(r.URL.Path)

	post, err := h.PostService.GetPostBySlug(ctx, slug)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Post not found",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post retrieved successfully",
		Data:    post,
	})
}

func (h *Handlers) GetPostByUUID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uuid := utils.ExtractUUIDFromPath(r.URL.Path)

	if uuid == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Invalid post UUID",
		})
		return
	}

	post, err := h.PostService.GetPostByUUID(ctx, uuid)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Post not found",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post retrieved successfully",
		Data:    post,
	})
}
