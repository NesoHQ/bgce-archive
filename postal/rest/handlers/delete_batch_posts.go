package handlers

import (
	"encoding/json"
	"net/http"
	"postal/post"
	"postal/rest/middlewares"
	"postal/rest/utils"
)

func (h *Handlers) BatchDeletePosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Authentication check
	userID := middlewares.GetUserID(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Parse request body
	var req post.BatchDeleteRequest
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

	// Execute batch delete
	if err := h.PostService.BatchDeletePosts(ctx, &req.UUIDs);

	err != nil {
		if err.Error() == "no posts found for provided uuids" {
			utils.SendError(w, http.StatusNotFound, "No posts found for provided uuids", err.Error())
			return
		}

		if err.Error() == "some posts not found for provided uuids" {
			utils.SendError(w, http.StatusNotFound, "Some posts not found for provided uuids", err.Error())
			return
		}

		if err.Error() == "no valid post UUIDs provided" {
			utils.SendError(w, http.StatusBadRequest, "no valid post UUIDs provided", err.Error())
			return
		}

		utils.SendError(w, http.StatusInternalServerError, "Failed to delete posts", err.Error())
		return
	}

	// Success response with detailed information
	utils.SendJson(w, http.StatusOK, map[string]any{
		"status":  true,
		"message": "Posts deleted successfully",
		"data": map[string]any{
			"deleted_count": len(req.UUIDs),
			"uuids":         req.UUIDs,
		},
	})
}