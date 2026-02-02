package handlers

import (
	"log/slog"
	"net/http"

	"cortex/rest/middlewares"
	"cortex/rest/utils"
)

func (h *Handlers) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	userResp, err := h.userService.GetUserByID(r.Context(), userID)
	if err != nil {
		slog.Error("Failed to get user profile", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "Failed to get profile", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    userResp,
		Message: "Profile retrieved successfully",
		Status:  http.StatusOK,
	})
}
