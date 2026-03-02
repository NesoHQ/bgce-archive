package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"postal/post"
	"postal/rest/middlewares"
	"postal/rest/utils"
)

func (h *Handlers) UpdatePost(w http.ResponseWriter, r *http.Request) {
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
	if userID == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req post.UpdatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Invalid request body",
			Error:   err.Error(),
		})
		return
	}

	// Validate request using the reusable validator
	if validationErrs := h.Validator.ValidateStruct(&req); validationErrs != nil {
		utils.SendJson(w, http.StatusBadRequest, map[string]any{
			"status":  false,
			"message": "Validation failed",
			"errors":  validationErrs.Errors,
		})
		return
	}

	postResp, err := h.PostService.UpdatePost(ctx, uint(id), req, userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  false,
			Message: "Failed to update post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Status:  true,
		Message: "Post updated successfully",
		Data:    postResp,
	})
}
