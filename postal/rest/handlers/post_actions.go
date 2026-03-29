package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"postal/rest/middlewares"
	"postal/rest/utils"
)

func (h *Handlers) PublishPost(w http.ResponseWriter, r *http.Request) {
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

	userID := middlewares.GetUserID(r)
	if err := h.PostService.PublishPost(ctx, uint(id), userID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to publish post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post published successfully",
	})
}

func (h *Handlers) UnpublishPost(w http.ResponseWriter, r *http.Request) {
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

	userID := middlewares.GetUserID(r)
	if err := h.PostService.UnpublishPost(ctx, uint(id), userID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to unpublish post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post unpublished successfully",
	})
}

func (h *Handlers) ArchivePost(w http.ResponseWriter, r *http.Request) {
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

	userID := middlewares.GetUserID(r)
	if err := h.PostService.ArchivePost(ctx, uint(id), userID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to archive post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post archived successfully",
	})
}

func (h *Handlers) DeletePost(w http.ResponseWriter, r *http.Request) {
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

	if err := h.PostService.DeletePost(ctx, uint(id)); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to delete post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post deleted successfully",
	})
}

func (h *Handlers) IncrementViewCount(w http.ResponseWriter, r *http.Request) {
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

	if err := h.PostService.IncrementViewCount(ctx, uint(id)); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to increment view count",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "View count incremented successfully",
	})
}
