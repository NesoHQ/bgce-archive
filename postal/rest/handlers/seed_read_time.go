package handlers

import (
	"net/http"

	"postal/rest/middlewares"
	"postal/rest/utils"
)

// SeedReadTime recalculates read time for all posts in the background
func (h *Handlers) SeedReadTime(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get user ID from context (injected by JWT middleware)
	userID, ok := ctx.Value(middlewares.UserIDKey).(uint)
	if !ok {
		utils.SendError(w, http.StatusUnauthorized, "Unauthorized", "User ID not found in context")
		return
	}

	// Trigger seeding process
	if err := h.PostService.SeedReadTime(ctx, userID); err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to start seeding", err.Error())
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Status:  true,
		Message: "Redis flushed and read-time seeding started in background",
	})
}
