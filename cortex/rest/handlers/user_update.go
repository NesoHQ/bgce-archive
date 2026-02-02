package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"cortex/rest/middlewares"
	"cortex/rest/utils"
	"cortex/user"
)

func (h *Handlers) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req user.UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Validation failed", utils.ParseValidationErrors(err))
		return
	}

	userResp, err := h.userService.UpdateUser(r.Context(), userID, req)
	if err != nil {
		slog.Error("Failed to update user profile", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "Failed to update profile", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    userResp,
		Message: "Profile updated successfully",
		Status:  true,
	})
}
