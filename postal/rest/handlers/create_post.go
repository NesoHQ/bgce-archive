package handlers

import (
	"encoding/json"
	"net/http"

	"postal/post"
	"postal/rest/middlewares"
	"postal/rest/utils"
)

func (h *Handlers) CreatePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get user ID from middleware
	userID := middlewares.GetUserID(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req post.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", err.Error())
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

	postResp, err := h.PostService.CreatePost(ctx, req, userID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to create post", err.Error())
		return
	}

	utils.SendJson(w, http.StatusCreated, map[string]any{
		"status":  true,
		"message": "Post created successfully",
		"data":    postResp,
	})
}
